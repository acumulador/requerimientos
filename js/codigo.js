$(document).on("ready",ini);
var sw = true;

function ini()
{
	$("#botonMenu").on("click",btnMenu);
    $('#exp-excel').on('click', prExportarExcel);
    $('#exp-pdf').on('click', prExportarPDF);
}

function prExportarExcel()
{
    $('<iframe src="../ExportarExcel"></iframe>').appendTo('body').hide();
}

function prExportarPDF()
{
    $('<iframe src="../ExportarPDF"></iframe>').appendTo('body').hide();
}

function btnMenu()
{
    if (sw) {
        $("#menu").animate({
            marginTop: -50
        });
        sw = false;
    }
    else
    { 
        $("#menu").animate({
            marginTop: -160
        });
        sw = true;
    }
    
}
/*
function btnMenu()
{
	if(sw==true)
	{
		$("#menu").animate({
			width: 170
		});

		$("#op1").animate({
			width: 160
		});

		$("#op2").animate({
			width: 160
		});
		
		$("#op3").animate({
			width: 160
		});
		
		$("#op4").animate({
			width: 160
		});

		$("#op5").animate({
			width: 160
		});
		
		$(".olo").fadeIn("fast");
		sw = false;
	}
	else
	{
		$("#menu").animate({
			width: 45
		});

		$("#op1").animate({
			width: 42
		});
		
		$("#op2").animate({
			width: 42
		});
		
		$("#op3").animate({
			width: 42
		});
		
		$("#op4").animate({
			width: 42
		});
		
		$("#op5").animate({
			width: 42
		});
		
		$(".olo").fadeOut("fast");
		sw = true;
	}
}
*/
