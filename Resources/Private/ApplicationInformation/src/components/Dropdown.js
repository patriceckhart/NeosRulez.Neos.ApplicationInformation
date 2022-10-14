import React, {Fragment, PureComponent} from 'react';
import {Icon, IconButton} from "@neos-project/react-ui-components";
import styles from "../styles.css"

class Dropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isToggleOn: false,
            appInfo: false
        };
        this.wrapperRef = React.createRef();
        this.handleClick = this.handleClick.bind(this);
        this.fetchAppInfo = this.fetchAppInfo.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    handleClick() {
        this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn
        }));
    }

    fetchAppInfo() {
        fetch('/neos/appinfo', {method: 'GET'})
            .then(response => response.text())
            .then(result => {
                this.setState({appInfo: JSON.parse(result)})
            })
            .catch(error => console.log('error', error));
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.setState({isToggleOn: false});
        }
    }

    componentDidMount() {
        this.fetchAppInfo()
        document.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    render() {

        return (
            <div ref={this.wrapperRef} className={styles.applicationInformation} >
                <IconButton icon="far fa-list-alt" className={styles.button} onClick={() => this.handleClick()} />
                {this.state.appInfo && parseInt(this.state.appInfo.exceptions) > 0 &&
                    <div className={styles.badge} >
                        {this.state.appInfo.exceptions}
                    </div>
                }
                {this.state.isToggleOn && this.state.appInfo &&
                    <div className={styles.applicationInformationDropdown} >
                        <div className={styles.applicationInformationDropdownWrapper} >
                            <strong>Application information</strong>
                            <span>This is a short system overview.</span>
                        </div>
                        <div className={styles.applicationInformationDropdownWrapper} >
                            <div className={styles.tableRow}>
                                <div className={styles.tableCol}>
                                    <Icon icon="fab fa-neos" /> Neos CMS Version
                                </div>
                                <div className={styles.tableCol}>
                                    {this.state.appInfo.neos}
                                </div>
                            </div>
                            <div className={styles.tableRow}>
                                <div className={styles.tableCol}>
                                    <Icon icon="fas fa-server" /> Webserver
                                </div>
                                <div className={styles.tableCol}>
                                    {this.state.appInfo.server}
                                </div>
                            </div>
                            <div className={styles.tableRow}>
                                <div className={styles.tableCol}>
                                    <Icon icon="fas fa-code" /> PHP Version
                                </div>
                                <div className={styles.tableCol}>
                                    {this.state.appInfo.php}
                                </div>
                            </div>
                            <div className={styles.tableRow}>
                                <div className={styles.tableCol}>
                                    <Icon icon="fas fa-database" /> Database
                                </div>
                                <div className={styles.tableCol}>
                                    {this.state.appInfo.database}
                                </div>
                            </div>
                            <div className={styles.tableRow}>
                                <div className={styles.tableCol}>
                                    <Icon icon="fas fa-desktop" /> Application context
                                </div>
                                <div className={styles.tableCol}>
                                    <div className={this.state.appInfo.context === 'Production' ? styles.production : styles.noProduction}>
                                        {this.state.appInfo.context}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.tableRow}>
                                <div className={styles.tableCol}>
                                    <Icon icon="fas fa-terminal" /> Operating system
                                </div>
                                <div className={styles.tableCol}>
                                    {this.state.appInfo.os}
                                </div>
                            </div>
                        </div>
                        <div className={styles.applicationInformationDropdownWrapper} >
                            <div className={styles.tableRow}>
                                <div className={styles.tableCol}>
                                    <Icon icon="fas fa-hdd" /> Disk space/usage
                                </div>
                                <div className={styles.tableCol}>
                                    {this.state.appInfo.diskSpace} GB/{this.state.appInfo.diskUsage} GB<br />
                                </div>
                            </div>
                            <div className={styles.tableRow}>
                                <div className={styles.tableCol}>
                                    <Icon icon="fas fa-hdd" /> Disk free
                                </div>
                                <div className={styles.tableCol}>
                                    {this.state.appInfo.diskFree} GB
                                </div>
                            </div>
                        </div>
                        <div className={styles.applicationInformationDropdownWrapper} >
                            {parseInt(this.state.appInfo.exceptions) > 0 &&
                                <Fragment>
                                    We have found <span className={styles.noProduction}>{this.state.appInfo.exceptions}</span> errors. Please check the <a href="/neos/administration/shel-neos-logs">logfile-viewer</a>.
                                </Fragment>
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Dropdown;
