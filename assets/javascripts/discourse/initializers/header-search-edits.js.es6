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

            const searchMenuWidget = api.container.factoryFor('widget:search-menu');
            const corePanelContents = searchMenuWidget.class.prototype['panelContents'];

            api.reopenWidget('search-menu', {
                html() {
                    let results = this.panelContents();
                    // results.push(h("a.close-search-panel", { attributes: {'href': '#', 'onclick': this.sendWidgetAction("toggleSearchMenu")} }, 'x'));
                    results.push(
                        this.attach("link", {
                            className: "close-search-panel",
                            title: "x",
                            label: "x"
                        })
                    );

                    if (this.state.formFactor === 'header') {
                        return results;
                    } else {
                        return this.attach('menu-panel', {
                            contents: () => results
                        });
                    }
                },

                panelContents: function() {
                    const formFactor = this.state.formFactor;
                    let showHeaderResults = this.state.showHeaderResults == null || this.state.showHeaderResults === true;
                    let contents = [];
                    if (formFactor === 'header') {
                        contents.push(this.attach('button', {
                            icon: 'search',
                            className: 'search-icon',
                            action: 'showResults'
                        }));
                    }
                    contents = contents.concat(...corePanelContents.call(this));
                    let results = contents.find(w => w.name == 'search-menu-results');
                    if (results && results.attrs.results) {
                        $('.search-menu.search-header').addClass('has-results');
                    } else {
                        $('.search-menu.search-header').removeClass('has-results');
                    }
                    $('.menu-panel.drop-down').append('<a href="#" class="close-search-pane">x</a>');
                    if (formFactor === 'menu' || showHeaderResults) {
                        return contents;
                    } else {
                        return contents.filter((widget) => {
                            return widget.name != 'search-menu-results' && widget.name != 'search-context';
                        });
                    }
                }

            });

        });

    }
};