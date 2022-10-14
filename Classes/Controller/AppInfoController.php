<?php
namespace NeosRulez\Neos\ApplicationInformation\Controller;

/*
 * This file is part of the NeosRulez.Neos.ApplicationInformation package.
 */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Mvc\View\JsonView;

class AppInfoController extends ActionController
{

    /**
     * @var string string
     */
    protected $defaultViewObjectName = JsonView::class;

    /**
     * @Flow\Inject
     * @var \Doctrine\ORM\EntityManagerInterface
     */
    protected $entityManager;

    /**
     * @Flow\Inject
     * @var \Neos\Flow\Package\PackageManager
     */
    protected $packageManager;

    /**
     * @Flow\SkipCsrfProtection
     * @return void
     */
    public function indexAction():void
    {
        $connection = $this->entityManager->getConnection();
        $mySqlVersion = $connection->executeQuery('select version()')->fetchColumn();
        $exceptionLogPath = constant('FLOW_PATH_DATA') . 'Logs/Exceptions/';

        $neosPackage = $this->packageManager->getPackage('Neos.Neos');
        $neosVersion = $neosPackage->getInstalledVersion();

        $diskSpace = ((int) disk_total_space('/') / 1000000000);
        $diskFreeSpace = ((int) disk_free_space('/') / 1000000000);
        $diskUsage = ((int) disk_total_space('/') / 1000000000) - $diskFreeSpace;

        $this->view->assign('value', [
            'neos' => $neosVersion,
            'server' => $_SERVER['SERVER_SOFTWARE'],
            'php' => $_SERVER['PHP_VERSION'],
            'database' => $mySqlVersion,
            'context' => $_SERVER['FLOW_CONTEXT'],
            'os' => $this->getOSInformation()['pretty_name'] . ' (' . $this->getOSInformation()['version_id'] . ')',
            'diskSpace' => number_format($diskSpace, '2', '.', ''),
            'diskUsage' => number_format($diskUsage, '2', '.', ''),
            'diskFree' => number_format($diskFreeSpace, '2', '.', ''),
            'exceptions' => count(glob($exceptionLogPath . '*'))
        ]);
    }

    /**
     * @Flow\SkipCsrfProtection
     * @return array|null
     */
    private function getOSInformation():array|null
    {
        if (!function_exists('shell_exec') || !is_readable('/etc/os-release')) {
            return null;
        }

        $os = shell_exec('cat /etc/os-release');
        $listIds = preg_match_all('/.*=/', $os, $matchListIds);
        $listIds = $matchListIds[0];

        $listVal = preg_match_all('/=.*/', $os, $matchListVal);
        $listVal = $matchListVal[0];

        array_walk($listIds, function(&$v, $k){
            $v = strtolower(str_replace('=', '', $v));
        });

        array_walk($listVal, function(&$v, $k){
            $v = preg_replace('/=|"/', '', $v);
        });

        return array_combine($listIds, $listVal);
    }

}
