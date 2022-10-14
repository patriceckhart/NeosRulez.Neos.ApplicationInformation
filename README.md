# Neos CMS application information. As you know it from TYPO3.

![ApplicationInformation](https://raw.githubusercontent.com/patriceckhart/NeosRulez.Neos.ApplicationInformation/master/Preview.png)

## Installation

Just run ```composer require neosrulez/neos-applicationinformation```

## Settings.yaml

You can enable it for roles or whatever ...

```yaml
Neos:
  Neos:
    Ui:
      frontendConfiguration:
        'NeosRulez.Neos.ApplicationInformation:enabled': '${Security.hasRole("Acme.Site:Editor") ? true : false}'
```

## Author

* E-Mail: mail@patriceckhart.com
* URL: http://www.patriceckhart.com
