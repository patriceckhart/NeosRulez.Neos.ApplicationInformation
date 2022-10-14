import React, {PureComponent} from 'react';
import manifest from '@neos-project/neos-ui-extensibility';
import Dropdown from "./components/Dropdown";

manifest('NeosRulez.Neos.ApplicationInformation:Dropdown', {}, (globalRegistry, {frontendConfiguration}) => {
    const containerRegistry = globalRegistry.get('containers');
    const showApplicationInformationDropdown = frontendConfiguration['NeosRulez.Neos.ApplicationInformation:enabled'];
    if(showApplicationInformationDropdown) {
        containerRegistry.set('PrimaryToolbar/Middle/ApplicationInformationDropdown', addApplicationInformation());
    }
});

const addApplicationInformation = () => {
    return class applicationInformation extends PureComponent {
        render() {
            return (
                <Dropdown />
            );
        }
    }
};
