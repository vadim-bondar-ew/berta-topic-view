import { registerUnbound } from 'discourse-common/lib/helpers';
import * as categoryLink from "discourse/helpers/category-link";
import favorites from 'discourse/plugins/discourse-favorites/lib/favorites';

var get = Em.get,
    escapeExpression = Handlebars.Utils.escapeExpression;


export function categoryLinkHTML(category, options) {
    var categoryOptions = {};

    favorites.isFavorite(category.id, isFavorite => {

    });

    // TODO: This is a compatibility layer with the old helper structure.
    // Can be removed once we migrate to `registerUnbound` fully
    if (options && options.hash) {
        options = options.hash;
    }

    console.log(this.$());

    if (options) {
        if (options.allowUncategorized) {
            categoryOptions.allowUncategorized = true;
        }
        if (options.link !== undefined) {
            categoryOptions.link = options.link;
        }
        if (options.extraClasses) {
            categoryOptions.extraClasses = options.extraClasses;
        }
        if (options.hideParent) {
            categoryOptions.hideParent = true;
        }
        if (options.categoryStyle) {
            categoryOptions.categoryStyle = options.categoryStyle;
        }
    }
    return new Handlebars.SafeString(
        categoryLink.categoryBadgeHTML(category, categoryOptions)
    );
}

registerUnbound('category-link', categoryLinkHTML);