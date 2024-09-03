var productModal = $("#productModal");

$(function () {
    // Fetch and display product list on page load
    $.get(productListApiUrl, function (response) {
        if(response) {
            var table = '';
            $.each(response, function(index, product) {
                table += '<tr data-id="'+ product.product_id +'" data-name="'+ product.name +'" data-unit="'+ product.uom_id +'" data-price="'+ product.price_per_unit +'">' +
                    '<td>'+ product.name +'</td>'+
                    '<td>'+ product.uom_name +'</td>'+
                    '<td>'+ product.price_per_unit +'</td>'+
                    '<td><span class="btn btn-xs btn-danger delete-product">Delete</span></td></tr>';
            });
            $("table").find('tbody').empty().html(table);
        }
    });
});

// Save Product
$("#saveProduct").on("click", function (e) {
    e.preventDefault();  // Prevent the default form submission

    var data = $("#productForm").serializeArray();
    var requestPayload = {
        product_name: null,
        uom_id: null,
        price_per_unit: null
    };

    // Build request payload from form data
    for (var i = 0; i < data.length; ++i) {
        var element = data[i];
        switch (element.name) {
            case 'name':
                requestPayload.product_name = element.value;
                break;
            case 'uoms':
                requestPayload.uom_id = element.value;
                break;
            case 'price':
                requestPayload.price_per_unit = element.value;
                break;
        }
    }

    // Validate form data
    if (!requestPayload.product_name || !requestPayload.uom_id || !requestPayload.price_per_unit) {
        alert("Please fill in all required fields");
        return;
    }

    // Save or update product via API
    callApi("POST", productSaveApiUrl, {
        'data': JSON.stringify(requestPayload)
    }).done(function (response) {
        // Handle success - close modal and refresh the product list
        alert("Product saved successfully!");
        productModal.modal('hide');

        // Reload the product list to reflect changes
        $.get(productListApiUrl, function (response) {
            if(response) {
                var table = '';
                $.each(response, function(index, product) {
                    table += '<tr data-id="'+ product.product_id +'" data-name="'+ product.name +'" data-unit="'+ product.uom_id +'" data-price="'+ product.price_per_unit +'">' +
                        '<td>'+ product.name +'</td>'+
                        '<td>'+ product.uom_name +'</td>'+
                        '<td>'+ product.price_per_unit +'</td>'+
                        '<td><span class="btn btn-xs btn-danger delete-product">Delete</span></td></tr>';
                });
                $("table").find('tbody').empty().html(table);
            }
        });
    }).fail(function (error) {
        alert("An error occurred while saving the product.");
        console.error(error);
    });
});

// Delete Product
$(document).on("click", ".delete-product", function () {
    var tr = $(this).closest('tr');
    var data = {
        product_id: tr.data('id')
    };

    var isDelete = confirm("Are you sure you want to delete " + tr.data('name') + " item?");
    if (isDelete) {
        // Make API call to delete the product
        callApi("POST", productDeleteApiUrl, data).done(function () {
            alert("Product deleted successfully!");
            tr.remove();  // Remove the row from the table
        }).fail(function (error) {
            alert("An error occurred while deleting the product.");
            console.error(error);
        });
    }
});

// Reset form when the modal is hidden
productModal.on('hide.bs.modal', function () {
    $("#id").val('0');
    $("#name, #uoms, #price").val('');
    productModal.find('.modal-title').text('Add New Product');
});

// Load UOM options when the modal is shown
productModal.on('show.bs.modal', function () {
    // Fetch UOM options for the form dropdown
    $.get(uomListApiUrl, function (response) {
        if(response) {
            var options = '<option value="">--Select--</option>';
            $.each(response, function (index, uom) {
                options += '<option value="' + uom.uom_id + '">' + uom.uom_name + '</option>';
            });
            $("#uoms").empty().html(options);
        }
    });
});
