import React from 'react';
import { Button, SidePanelFactory, PanelHeaderFactory } from 'kepler.gl/components';

const appName = "foo";
const version = "1.0.0";

interface AppProps {
    uiState: any;
    uiStateActions: any;
}

function CustomSidePanelFactory(
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
                  My kepler.gl app
                  <Button onClick={() => this.handleClick()}>Foo</Button>
                  Bar

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
                </div>
            )
        }
    };
};

CustomSidePanelFactory.deps = [
    PanelHeaderFactory
];

export { CustomSidePanelFactory }
