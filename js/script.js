function removeActiveBtnClass(){
    var c = $.mobile.activeBtnClass;
    setTimeout(function(){$( '.' + c ).removeClass(c)} , 150);
}

/* panels */
$( document ).on( "pagecreate", "[data-role='page']", function() {
    $( document ).on( "swipeleft swiperight", "[data-role='page']", function( e ) {
        if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
            if ( e.type === "swipeleft" ) {
                closePanel( "sidebar-left" );
                openPanel( "sidebar-right" );
            } else if ( e.type === "swiperight" ) {
                openPanel( "sidebar-left" );
                closePanel( "sidebar-right" );
            }
        }
    });
});

function openPanel(id){
    $('.' + $.mobile.activePageClass + ' #' + id ).panel( "open" );
    removeActiveBtnClass();
}

function closePanel(id){
    $('.' + $.mobile.activePageClass + ' #' + id ).panel( "close" );
    removeActiveBtnClass();
}

function togglePanel(id){
    $('.' + $.mobile.activePageClass + ' #' + id ).panel( "toggle" );
    removeActiveBtnClass();
}

/* trigger resize */
$( document ).on( "pageshow ", function() {
    $( window ).trigger( "resize" );
});

$( window ).on( "resize", function(){
    if( $( window ).width() > 768 ) openPanel( "sidebar-left" ); else closePanel( "sidebar-left" );
});


function contactus() {

     $.ajax({url: 'http://secure.prj.be/contactus/?callback=?',
        data: { outputType:'json', form : $('#contactusForm').serialize()},
        type: 'get',                   
        async: 'true',
        dataType:"jsonp",
        contentType: "application/json",
        beforeSend: function() {
             $.mobile.loading( "show" ); // This will show ajax spinner
        },
        complete: function() {
             $.mobile.loading( "hide" ); // This will hide ajax spinner
        },
        success: function (result) {
            if(result.status) {
                if($("#formAlert").length == 0){
                    $('#contactusForm').prepend("<p id='formAlert'>Mesajınız iletildi. <br/>İlginiz için teşekkür ederim</p>");                         
                    setTimeout(function() {
                      $("#formAlert").hide("slow");      
                    }, 5000);
                }    
                else {
                    $("#formAlert").show();
                    $('#formAlert').html("Mesajınız iletildi. <br/>İlginiz için teşekkür ederim");
                    setTimeout(function() {
                      $("#formAlert").hide("slow");      
                    }, 5000);     
                }                
            } else {                            
                if($("#formAlert").length == 0){   
                    $('#contactusForm').prepend("<p id='formAlert'>"+result.message+"</p>"); 
                    setTimeout(function() {
                      $("#formAlert").hide("slow");      
                    }, 5000);   
                }
                else {
                    $("#formAlert").show();
                    $('#formAlert').html(result.message);
                    setTimeout(function() {
                      $("#formAlert").hide("slow");      
                    }, 5000);    
                }
            }
        },
        error: function (request,error) {          
            if($("#formAlert").length == 0){       
                $('#contactusForm').prepend("<p id='formAlert'>Sunucu ile iletişim hatası oluştu. Lütfen daha sonra tekrar deneyin!</p>");
                setTimeout(function() {
                  $("#formAlert").hide("slow");      
                }, 5000);     
            }
            else {
                $("#formAlert").show();
                $('#formAlert').html("Network error has occurred please try again!");
                setTimeout(function() {
                  $("#formAlert").hide("slow");      
                }, 5000);   
            }
        }
    });                   

}


function tarih(date){

    if(date % 1 !== 0) return false;  
    if(date<1000) return false;

    var time    = (parseInt(new Date().getTime()))/1000;
    var fark    = time-parseInt(date); //to get the time since that moment

    if(fark<0) fark= fark * -1;
        
    var tokens = new Array();
        tokens[0] = "yıl";
        tokens[1] = "ay";
        tokens[2] = "hafta";
        tokens[3] = "gün";
        tokens[4] = "saat";
        tokens[5] = "dakika";
        tokens[6] = "saniye";
                
    var values = new Array();
        values[0] = 31536000;
        values[1] = 2592000;
        values[2] = 604800;
        values[3] = 86400;
        values[4] = 3600;
        values[5] = 60;
        values[6] = 1;
        
    for(i=0; i<=tokens.length; i++) {
        if(values[i] > fark) continue;
        var numberOfUnits=Math.ceil(fark/values[i]);
        return numberOfUnits+" "+tokens[i]+" önce";
    }
}
        
$(document).ready(function(){
    
    
    $('p.ui-li-aside').each(function(index) {
        var sayi=$(this).text();
        var date= parseInt(sayi);
        var fark=tarih(date);
        if(sayi % 1 === 0) { $(this).text(fark.toString());  }
    });
    
    $("#page1 #mainButton").hide();

});



function jqemoji(str){

    var haut = 0;
    var n = 0;
    CPstring = '';

    for(i=0;i<str.length;i++){
        var code = str.charCodeAt(i);
        var b = str.charCodeAt(i); 

        if(code>1000) {

            if (b < 0 || b > 0xFFFF) {
                CPstring += 'Error ' + dhex(b).toLowerCase() + '!';
            }
            if (haut != 0) {
                if (0xDC00 <= b && b <= 0xDFFF) {
                    CPstring += ' imgFront'+ dhex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)).toLowerCase() + 'imgBack ';
                    haut = 0;
                    continue;
                    }
                else {
                    CPstring += '!erreur ' + dhex(haut).toLowerCase() + '!';
                    haut = 0;
                    }
            }

            if (0xD800 <= b && b <= 0xDBFF) {
                haut = b;
            }
            else {
                CPstring += ' imgFront'+ dhex(b).toLowerCase() + 'imgBack ';
            }

        }
        else {
                CPstring = CPstring+String.fromCharCode(code);
        }
            
        
    }

    CPstring = CPstring.substring(0, CPstring.length-1);
    CPstring = replaceAll(CPstring , 'imgFront', '<img class="emoji-img" width="16" src="http://twemoji.maxcdn.com/16x16/');
    CPstring = replaceAll(CPstring, 'imgBack', '.png"/>');

    return CPstring;
};

function dhex(str) {
 return (str+0).toString(16).toUpperCase();
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}