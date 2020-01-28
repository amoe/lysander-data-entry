import React from 'react';
import { Button, SidebarFactory, PanelHeaderFactory } from 'kepler.gl/components';

const appName = "foo";
const version = "1.0.0";

interface AppProps {
    uiState: any;
    uiStateActions: any;
}

function CustomSidePanelFactory(
    Sidebar: any,
    PanelHeader: any,
) {
    return class CustomSidePanel extends React.Component<AppProps> {
        handleClick() {
            console.log("it was clicked");
        }

        render() {
            /* const uiState = this.props.uiState;
             * const uiStateActions = this.props.uiStateActions;*/

            return (
                <div>
                  <Sidebar width={300}
                           isOpen={true}
                           minifiedWidth={0}>
                    
                    <PanelHeader appName="Lysander" version="0.0.1"/>

                    {/* <PanelHeader
                        appName={appName}
                        version={version}
                        onExportImage={() => this.handleClick()}
                        onExportData={() => this.handleClick()}
                        visibleDropdown={uiState.visibleDropdown}
                        showExportDropdown={uiStateActions.showExportDropdown}
                        hideExportDropdown={uiStateActions.hideExportDropdown}
                        onExportMap={() => this.handleClick()}
                        onSaveMap={() => this.handleClick()}

                        />
                      */}
                  </Sidebar>
                </div>
            )
        }
    };
};

CustomSidePanelFactory.deps = [
    SidebarFactory,
    PanelHeaderFactory
];

export { CustomSidePanelFactory }
