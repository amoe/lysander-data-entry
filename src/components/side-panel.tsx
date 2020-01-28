import React from 'react';
import {
    Button, SidebarFactory, PanelHeaderFactory, ItemSelector, PanelLabel
} from 'kepler.gl/components';

const appName = "foo";
const version = "1.0.0";

interface AppProps {
    uiState: any;
    uiStateActions: any;
}

interface AppState {
    selectedItems: string[];
}

function CustomSidePanelFactory(
    Sidebar: any,
    PanelHeader: any,
) {
    return class CustomSidePanel extends React.Component<AppProps, AppState> {
        constructor(props: AppProps) {
            super(props);
            this.state = {selectedItems: ['foo']};
        }

        onChange(items: any) {
            this.setState({selectedItems: items});
        }

        render() {
            /* const uiState = this.props.uiState;
             * const uiStateActions = this.props.uiStateActions;*/
            // Includes visStateActions which can be used to dispatch actions.
//            console.log(this.props);

            return (
                <div>
                  <Sidebar width={300}
                           isOpen={true}
                           minifiedWidth={0}>
                    
                    <PanelHeader appName="Lysander" version="0.0.1"/>

                    <PanelLabel>Pilot</PanelLabel>
                    <ItemSelector options={['foo', 'bar', 'baz']}
                                  selectedItems={this.state.selectedItems}
                                  multiSelect={true}
                                  searchable={false}
                                  onChange={this.onChange.bind(this)}></ItemSelector>

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
