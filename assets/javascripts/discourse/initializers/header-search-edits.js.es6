import { withPluginApi } from 'discourse/lib/plugin-api';
import { wantsNewWindow } from 'discourse/lib/intercept-click';
import { on } from 'ember-addons/ember-computed-decorators';

export default {
    name: 'header-search',
    initialize(container){

        const searchMenuWidget = container.factoryFor('widget:search-menu');
        const corePanelContents = searchMenuWidget.class.prototype['panelContents'];

        withPluginApi('0.8.9', api => {

            api.modifyClass('component:site-header', {

            });

            api.reopenWidget('search-menu', {
                html() {
                    if (this.state.formFactor === 'header') {
                        return this.panelContents();
                    } else {
                        return this.attach('menu-panel', {
                            maxWidth: '100%',
                            contents: () => this.panelContents()
                        });
                    }
                }
            });
        });
    }
};