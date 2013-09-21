'use strict';

$(document).ready(function () {
    var responsiveHelper = undefined;
    var breakpointDefinition = {
        tablet: 1024,
        phone : 480
    };

    var tableElement;
    var destroyingDataTable = false;

    // Initialize buttons
    $('button').click(function (event) {
        var ajaxUrl = $(this).attr('data-ajax-url');
        createDataTable(ajaxUrl);
    });

    /**
     * Create the data table.
     * @param {String} ajaxUrl
     */
    function createDataTable(ajaxUrl) {
        tableElement = $('#example');

        // This next part helps to clean things up so we can recreate a data
        // table on the same table element.
        if ($.fn.DataTable.fnIsDataTable(tableElement[0])) {
            // Set the destroying flag to prevent the responsive table from
            // being initialized during this phase.
            destroyingDataTable = true;

            // Get data table instance
            tableElement.dataTable();

            // Since we are destroying the table, let's clear it to speed things
            // up.
            tableElement.fnClearTable(false);

            // Disabling the helper will reset the the responsive changes to the
            // DOM.
            responsiveHelper.disable(true);

            // Remove the responsive helper.
            responsiveHelper = undefined;

            // Now that all things have been restored, let's destroy the table
            tableElement.fnDestroy();

            // Clear flag
            destroyingDataTable = false;
        }


        // Create data table
        tableElement.dataTable({
            sDom             : '<"row"<"span6"l><"span6"f>r>t<"row"<"span6"i><"span6"p>>',
            sPaginationType  : 'bootstrap',
            oLanguage        : {
                sLengthMenu: '_MENU_ records per page'
            },
            // disable sorting on the checkbox column
            aoColumnDefs     : [
                {
                    aTargets : [ 0 ],             // Column number which needs to be modified
                    bSortable: false,             // Column is not sortable
                    // Custom render function - add checkbox
                    mRender  : function (data, type) {
                        return '<input type="checkbox" name="id" value="' + data + '" class="checkbox"/>';
                    },
                    sClass   : 'centered-cell'    // Optional - class to be applied to this table cell
                },
                {
                    aTargets: [ 4 ],              // Column number which needs to be modified
                    sClass  : 'centered-cell'     // Optional - class to be applied to this table cell
                },
                {
                    aTargets: [ 5 ],              // Column number which needs to be modified
                    sClass  : 'centered-cell'     // Optional - class to be applied to this table cell
                }
            ],
            bProcessing      : true,
            bAutoWidth       : false,
            sAjaxSource      : ajaxUrl,
            bDestroy         : true,
            // Custom call back for AJAX
            fnServerData     : function (sSource, aoData, fnCallback, oSettings) {
                oSettings.jqXHR = $.ajax({
                    dataType: 'json',
                    type    : 'GET',
                    url     : sSource,
                    data    : aoData,
                    success : function (data) {
                        fnCallback(data);
                    }
                });
            },
            fnPreDrawCallback: function () {
                // Initialize the responsive data table helper once.
                if (!responsiveHelper && !destroyingDataTable) {
                    responsiveHelper = new ResponsiveDatatablesHelper(tableElement, breakpointDefinition);
                }
            },
            fnRowCallback    : function (nRow) {
                if (responsiveHelper) {
                    responsiveHelper.createExpandIcon(nRow);
                }
            },
            fnDrawCallback   : function () {
                // This function will be called every the table redraws.
                // Specifically, we're interested when next/previous page
                // occurs.
                toggleMasterCheckBasedOnAllOtherCheckboxes();

                // Respond to windows resize.
                if (responsiveHelper) {
                    responsiveHelper.respond();
                }
            },
            fnInitComplete   : function () {
                initializeMasterCheckboxEventHandlers();
                initializeCheckboxEventHandlers();
                initializeTableRowEventHandlers();
            }
        });
    }


    // NOTE: We did not add class="centered-cell" to the Engine version and CSS grade columns
    //       as in other examples.


    /**
     * Toggles the master checkbox if all checkboxes in the table that
     * are visible are checked.
     */
    function toggleMasterCheckBasedOnAllOtherCheckboxes() {
        // What we need to do here is check to see if every checkbox is checked.
        // If it is, the master checkbox in the header should be checked as well.
        var allCheckboxes = $('tbody input:checkbox', tableElement);
        var totalCheckboxCount = allCheckboxes.length;
        if (totalCheckboxCount) {
            var checkedChecboxCount = allCheckboxes.filter(':checked').length;
            $('#masterCheck', tableElement).prop('checked', totalCheckboxCount === checkedChecboxCount);
        }
    }

    /**
     * Initialize master checkbox event handlers.
     */
    function initializeMasterCheckboxEventHandlers() {
        // Enable master checkbox to check/uncheck all checkboxes
        $('#masterCheck', tableElement).click(function () {
            // Toggle all checkboxes by triggering a click event on them.  The click
            // event will fire the changed event that we can handle.  Directly changing
            // the checked property like this
            //
            //    $('tbody input:checkbox', tableContainer).not(this).prop('checked', this.checked);
            //
            // toggles all checkboxes but does not trigger click events.  Because there's
            // no click event, there's no changed events on the checkboxes.  We need the
            // changed events so that we can keep track of the checked checkboxes.
            if (this.checked) {
                $('tbody input:checkbox:not(:checked)', tableElement).not(this).trigger('click');
            } else {
                $('tbody input:checkbox:checked', tableElement).not(this).trigger('click');
            }
        });
    }

    /**
     * Initialize checkbox event handlers.  elementCollection can
     * be one of the following:
     *     - jQuery collection of checkbox elements
     *     - jQuery selector
     *     - undefined
     *
     * If elementCollection is undefined, all checkboxes in DataTable
     * will be selected.
     *
     * @param {Object|String|undefined} elementCollection
     */
    function initializeCheckboxEventHandlers(elementCollection) {
        if (elementCollection === undefined) {
            elementCollection = $('input:checkbox', tableElement.fnGetNodes())
        } else if (elementCollection === 'string') {
            elementCollection = $(elementCollection, tableElement.fnGetNodes())
        }

        elementCollection.off('change').change(function (event) {
            // Keep track of the checked checkboxes.
            if (event.target.checked) {
                // Do something with the checked item
                // callSomeFunction(event.target.name, event.target.value);
            } else {
                // Do something with the unchecked item
                // callSomeFunction(event.target.name, event.target.value);
            }

            // Affect the other parts of the table/page...
            toggleMasterCheckBasedOnAllOtherCheckboxes();
        });
    }

    /**
     * Initialize table row event handler.  elementCollection can
     * be one of the following:
     *     - jQuery collection of checkbox elements
     *     - jQuery selector
     *     - undefined
     *
     * If elementCollection is undefined, all table rows in DataTable
     * will be selected.
     *
     * @param {Object|String|undefined} elementCollection
     */
    function initializeTableRowEventHandlers(elementCollection) {
        if (elementCollection === undefined) {
            elementCollection = $(tableElement.fnGetNodes())
        } else if (elementCollection === 'string') {
            elementCollection = $(elementCollection, tableElement.fnGetNodes())
        }

        // Do something with elementCollection as needed.
    }
});
