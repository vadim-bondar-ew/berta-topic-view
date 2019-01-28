import { withPluginApi } from 'discourse/lib/plugin-api';
import { wantsNewWindow } from 'discourse/lib/intercept-click';
import { h } from "virtual-dom";
import { on } from 'ember-addons/ember-computed-decorators';

export default {
    name: 'header-search',
    initialize(container){

        const searchMenuWidget = container.factoryFor('widget:search-menu');
        const corePanelContents = searchMenuWidget.class.prototype['panelContents'];

        withPluginApi('0.8.9', api => {

            api.modifyClass('component:site-header', {

                @on('didInsertElement')
                initSizeWatcher() {
                    Ember.run.scheduleOnce('afterRender', () => {
                        this.$('.menu-panel.drop-down').append('<a href="#" class="close-search-pane">x</a>');
                    });
                },

            });

            api.reopenWidget('search-menu', {
                html() {
                    let results = [];
                    // results.push(h("a.close-search-panel", { attributes: {'href': '#', 'onclick': this.sendWidgetAction("toggleSearchMenu")} }, 'x'));
                    results.push(
                        this.attach("link", {
                            action: this.sendWidgetAction("toggleSearchMenu"),
                            className: "close-search-panel",
                            title: "x",
                            label: "x"
                        })
                    );
                    results.push(this.panelContents());
                    console.log(results);

                    if (this.state.formFactor === 'header') {
                        return results;
                    } else {
                        return this.attach('menu-panel', {
                            contents: () => results
                        });
                    }
                }
            });

        });

    }
};