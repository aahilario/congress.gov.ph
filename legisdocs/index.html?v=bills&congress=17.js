jQuery(function(){

  var batch = [];
  var panel = {};
  var conversion_limit = 0;
  var conversions = 0;
  var batch_size = 20;

  function send_unscanned() {
    $('div[class~=panel]').find('div[class*=unscanned]').first().each(function(){
      panel_test($(this));
    });
  }

  function bill_record_update(data, textStatus, jqXHR) {
    var inter_conversion_delay = 20;
    panel = {};
    conversions++;
    if ( conversion_limit > 1 ) {
      if ( conversions >= conversion_limit ) { 
        batch_size = 0;
        if ( batch.length > 0 ) {
          window.setTimeout(function(e){
            send_bill_summary();
          },20);
        }
        return true;
      }
    }
    if ( ( batch_size > 0 ) && ( batch.length < batch_size ) ) {
      inter_conversion_delay = 1;
      // console.log("No delay "+conversions);
    }
    window.setTimeout(function(e){
      send_unscanned();
    },inter_conversion_delay);
    return true;
  }

  function send_bill_summary() {
    var current = $('span#mainpane_title').data('current');
    var file = $('span#mainpane_title').data('file');
    if ( panel.heading )
      batch[batch.length] = panel;
    if ( ( batch_size == 0 ) || ( batch.length >= batch_size ) ) {
      $.ajax({
        method   : "POST",
        url      : "/legislature",
        dataType : 'json',
        beforeSend : function( jqXHR, settings ) {
          batch = [];
        }, 
        data     : { 
          a       : "record",
          file    : file,
          current : current,
          data    : batch 
        },
        success: (bill_record_update)
      });
    }
    else {
      bill_record_update(null,null,null);
    }
  }

  function store_bill_summary(p) {
    $(p).removeClass('unscanned')
      .addClass('removable')
      .find('p').each(function(){
      var section_raw = $(this).find('span.text-warning').text();
      var section_id = section_raw.replace( /^([^:]{1,}):/, "$1" ).toLowerCase().replace(/[^0-9a-z ]/,'').replace(' ','-');
      $(this).find('span.text-warning').remove();
      panel[section_id] = $(this).text();
      $(this).text('');
      // console.log('Store bill summary '+section_id);
    });
    $(p).find('span.pull-left').first().each(function(){
      $(this).find('a').each(function(){
        var data_id = $(this).attr('data-id') || '';
        if ( data_id.length > 0 ) {
          panel['historyid'] = data_id;
        }
        else {
          if ( !(panel.docs) )
            panel['docs'] = [];
          panel['docs'][panel['docs'].length] = {
            doclabel: $(this).text(),
            docurl: $(this).attr('href')
          };
        }
        return true;
      });
      $(this).find('a').remove();
    });
    $(p).find('p').remove();
  }

  function panel_test(p) {
    if ( $(p).hasClass('panel-body') ) {
      $(p).removeClass('unscanned');
      store_bill_summary(p);
      send_bill_summary();
      return true;
    }
    if ( $(p).hasClass('panel-heading') ) {
      var heading = $(p).find('span[class~=text-muted]').first().text();
      $(p).removeClass('unscanned');
      panel = { heading : heading };
      // console.log( 'Heading: '+panel.heading );
      window.setTimeout(function(e){
        $('div[class~=removable]').remove();
        $('div[class~=panel]').find('div[class~=unscanned]').first().each(function(){
          panel_test(this);
        });
      },10);
      $(p).find('span[class~=text-muted]').remove();
      return true;
    }
    return false;
  }

  $('div[class~=panel]').find('div.panel-body').addClass('unscanned');
  $('div[class~=panel]').find('div.panel-heading').addClass('unscanned');

  send_unscanned();

});
