/**
 * Plugin require HandlerBars.JS
 */

function tag_input() {
    var $input = $('._tagsinput');

    var users = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: user_suggestion_path + '?q=%QUERY',
            wildcard: '%QUERY'
        }
    });
    users.initialize();

    $input.tagsinput({
        itemValue: 'email',
        template: '<a target="_blank" href="Users/Management/Detail?id={{id}}">{{email}}</a>',
        typeaheadjs: {
            name: 'email',
            displayKey: 'email',
            source: users.ttAdapter()
        }
    });

    $input.each(function () {
        var $self = $(this);
        var src = $self.data('src');
        src.forEach(function (item) {
            $self.tagsinput('add', item);
        });
    });

    $input.on('beforeItemAdd', function (e) {
        var $td = $(e.target).parents('td._account_permission');
        var account_permission = {
            user_id: e.item.id,
            account_id: $td.data('account-id'),
            permission: $td.data('permission')
        };
        Account.addPermission(account_permission).done(function (response) {
            e.cancel = !(response && response.type);
        });
    });

    $input.on('beforeItemRemove', function (e) {
        var $td = $(e.target).parents('td._account_permission');
        var account_permission = {
            user_id: e.item.id,
            account_id: $td.data('account-id'),
            permission: $td.data('permission')
        };
        Account.removePermission(account_permission).done(function (response) {
            e.cancel = !(response && response.type);
        });
    });
}