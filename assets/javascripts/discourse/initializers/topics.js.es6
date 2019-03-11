import { withPluginApi } from 'discourse/lib/plugin-api';
import { on, observes } from 'ember-addons/ember-computed-decorators';

export default {
  name: 'topics',
  initialize(container){

    withPluginApi('0.8.12', (api) => {

      api.modifyClass('component:topic-list',  {
        // Lifecyle logic

        @on('init')
        setup() {
          Ember.run.scheduleOnce('afterRender', this, () => {
            this.$('.mansory .right-column:nth-child(4)').addClass("top-margin");

            let _wrapper = this.$(".mansory"),
                _cards = this.$(".topic-list-item"),
                _cols = 2,
                _out = [],
                _col = 0;

            console.log("TEST");
            console.log(_wrapper);
            console.log(_cards);

            while(_col < _cols) {
              for (let i = 0; i < _cards.length; i += _cols) {
                let _val = _cards[i + _col];
                if (_val !== undefined)
                  _out.push(_val);
              }
              _col++;
            }
            // _wrapper.html(_out);

          });
        },

        @on('didInsertElement')
        setupListStyle() {
          if( $("#suggested-topics").length == 0 && $(".user-messages-page").length == 0 ) {
            this.$(".topic-list-item").wrapAll("<div class='mansory'></div>");
            this.$(".topic-list-item").append(this.$("<div class='arrow'></div>"));
          }
        }

      });

      api.modifyClass('component:topic-list-item', {

        // Lifecyle logic

        @on('init')
        setup() {
          Ember.run.scheduleOnce('afterRender', this, this.applyOrdering);
        },

        @on('init')
        _setupProperties() {
          if( $("#suggested-topics").length == 0 && $(".user-messages-page").length == 0 ) {
            this.set('tagName', 'div');
          } else {
            this.set('tagName', 'tr');
          }
        },

        applyOrdering() {
          var screenWidth = this.$(window).innerWidth() / 2;
          if (this.$().offset().left > screenWidth) {
            this.$().addClass("right-column");
          } else {
            this.$().addClass("left-column");
          }
        }

      });


    });
  }
};
