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
                panelContents() {
                    const contextEnabled = searchData.contextEnabled;

                    let searchInput = [
                        this.attach("search-term", { value: searchData.term, contextEnabled })
                    ];
                    if (searchData.term && searchData.loading) {
                        searchInput.push(h("div.searching", h("div.spinner")));
                    }

                    const results = [
                        h("div.search-input", searchInput),
                        this.attach("search-context", {
                            contextEnabled,
                            url: this.fullSearchUrl({ expanded: true })
                        })
                    ];

                    if (searchData.term && !searchData.loading) {
                        results.push(
                            this.attach("search-menu-results", {
                                term: searchData.term,
                                noResults: searchData.noResults,
                                results: searchData.results,
                                invalidTerm: searchData.invalidTerm,
                                searchContextEnabled: searchData.contextEnabled
                            })
                        );
                    }
                    results.push(h("a", { attributes: { "href": "#" } }, "x"));
                    
                    return results;
                },

                html() {
                    if (this.state.formFactor === 'header') {
                        return this.panelContents();
                    } else {
                        return this.attach('menu-panel', {
                            contents: () => this.panelContents()
                        });
                    }
                }
            });

        });

    }
};