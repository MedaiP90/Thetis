function resizeWindow() {
    // reduce to zero canvas dimensions
    $('canvas').height(0).width(0);

    // define variables and assign dimensions
    var height = parseInt($(window).innerHeight() * 0.99),
        width = $(window).innerWidth(),
        marginVer = parseInt(height * 0.1),
        cellWidth = parseInt(width/3),
        contHeight = height - 2 * marginVer - 16,
        linksHeight = parseInt(marginVer * 0.95),
        linksWidth = parseInt(width * 0.2),
        tabHeight = parseInt((contHeight - 24 - linksHeight) / 2);
    
    // canvas size
    var cHeight = parseInt(contHeight / 2) - $('.name')[0].clientHeight;

    // assign dimensions to elements
    $('body').height(height).width(width);
    $('#contenuto').height(contHeight).width(width);
    $('#top_content').height(marginVer).width(width);
    $('#bottom_content').height(marginVer).width(width);
    $('#aborted').height(contHeight).width(contHeight);
    $('.lefter').width(cellWidth).height(marginVer);
    $('.midler').width(cellWidth).height(marginVer);
    $('.rigter').width(cellWidth).height(marginVer);
    $('button').height(linksHeight).width(linksWidth);
    $('canvas').height(cHeight).width(cHeight);
    $('.top').height(tabHeight);
    $('.bottom').height(tabHeight);

    // setup css
    $('#contenuto').css({
        position: 'absolute',
        top: marginVer + 14
    });
    $('#bottom_content').css({
        position: 'absolute',
        bottom: 0
    });
    $('button').css({
        position: 'relative',
        top: 4
    });
    $('#gpsh').css({
        position: 'relative',
        bottom: 4
    });
    $('#drift').css({
        left: cellWidth - linksWidth
    });
    $('#correction').css({
        left: 0
    });
}