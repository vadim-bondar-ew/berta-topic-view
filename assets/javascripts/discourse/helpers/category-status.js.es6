import { registerUnbound } from 'discourse-common/lib/helpers';

var get = Em.get,
    escapeExpression = Handlebars.Utils.escapeExpression;

export function categoryBadgeHTML(category, opts) {
    opts = opts || {};

    if (
        !category ||
        (!opts.allowUncategorized &&
            Ember.get(category, "id") ===
            Discourse.Site.currentProp("uncategorized_category_id") &&
            Discourse.SiteSettings.suppress_uncategorized_badge)
    )
        return "";

    return _renderer(category, opts);
}

export function categoryLinkHTML(category, options) {
    var categoryOptions = {};
    console.log(options);
    // TODO: This is a compatibility layer with the old helper structure.
    // Can be removed once we migrate to `registerUnbound` fully
    if (options && options.hash) {
        options = options.hash;
    }

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
        categoryBadgeHTML(category, categoryOptions)
    );
}

registerUnbound('category-link', categoryLinkHTML);