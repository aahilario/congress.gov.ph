function validateForm(f) {
  // console.log(f);

  // $.validator.addMethod(
  //   "valueNotEquals",
  //   function(value, element, arg) {
  //     return arg !== value;
  //   },
  //   "Value must not equal arg."
  // );

  f.validate(
    {
      // ignore: [],
      rules: {
        nameDependent: {
          required: true
          // minlength: 2
        },
        eMail: {
          required: true
          // minlength: 2
        },
        action: "required"
      },
      messages: {
        nameDependent: {
          required: "PLEASE ENTER NAME OF DEPENDENT"
        },
        eMail: {
          required: "PLEASE ENTER EMAIL ADDRESS"
        },
        action: "Please provide some data"
      }
    }

  );

}


//  Save and submit request
function saveRecord() {
  // var formDetails = "frmDetails";
  var empcode = $("#empcode").val();
  var requestId = $("#requestId").val();
  var reasonId = $("#reasonId").val(); 
  if( typeof $("#name_dependent").val() !== 'undefined' && $("#name_dependent").val() !== null ){
    var name_dependent = $("#name_dependent").val();
  }
  var eMail = $("#eMail").val(); 
  
  $("#submitSuccess").modal("show");


  $.post(
    "ajax/submitRequest.php",
    {
      empcode: empcode,
      requestId: requestId,
      reasonId: reasonId,
      name_dependent: name_dependent,
      eMail: eMail
    },
    function(data, status) {
      // console.log("Success");
     
       window.location = '../online';
      //  location.reload();
       // Open modal popup
      $("#exampleModal").modal("show");

      

    }
  );
  
}

$(document).ready(function() {
  var initRequest = $("input[name='rdoRequest']:checked").val();
  if (initRequest != 4) {
    $("#divDependent").hide();
  } else {
    $("#divDependent").show();
  }
  
  $("input[name='rdoRequest']").click(function() {
    var rdoVal = $("input[name='rdoRequest']:checked").val();
    if (rdoVal != 4) {
      $("#divDependent").hide();
    } else {
      $("#divDependent").show();
    }
  });
  
  jQuery.validator.setDefaults({
    // debug: true,
    success: "valid"
  });

  var form = $("#frmRequest");
  var formDetails = $("#frmDetails");
  validateForm(form);
  

  $("#submitRequest").click(function() {
    // console.clear();
    if (form.valid()) {
      form.submit();
    }
    
  });

  $("#cancelRequest").click(function() {
    // console.clear();
    form.trigger("reset");
    formDetails.trigger("reset");

    window.location = '../online'
  });

});

