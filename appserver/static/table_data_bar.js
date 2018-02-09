require([
    'jquery',
    'underscore',
    'splunkjs/mvc',
    'views/shared/results_table/renderers/BaseCellRenderer',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function($, _, mvc, BaseCellRenderer, TableView) {

    "use strict";

    var DataBarCellRenderer = BaseCellRenderer.extend({
        canRender: function(cell) {
            return (cell.field.indexOf('%') !== -1);
        },
        render: function($td, cell) {
            $td.addClass('data-bar-cell').html(_.template('<div class="data-bar-wrapper"><div class="data-bar" style="width:<%- percent %>%"></div></div>', {
                percent: Math.min(Math.max(parseFloat(cell.value), 0), 100)}));
        }
    });

    $.each(mvc.Components.getInstances(), function (i, view) {
         if (view instanceof TableView) {
             view.addCellRenderer(new DataBarCellRenderer());
         }
     });
});