function resizeWindow() {
    // define variables and assign dimensions
    var height = parseInt($(window).innerHeight() * 0.99),
        width = $(window).innerWidth(),
        marginVer = parseInt(height * 0.1),
        cellWidth = parseInt(width/3),
        contHeight = height - 2 * marginVer - 16,
        linksHeight = parseInt(marginVer * 0.95),
        linksWidth = parseInt(width * 0.2),
        tabHeight = parseInt((contHeight - 24 - linksHeight) / 2);

    // assign dimensions to elements
    $('body').height(height).width(width);
    $('#contenuto').height(contHeight).width(width);
    $('#top_content').height(marginVer).width(width);
    $('#bottom_content').height(marginVer).width(width);
    $('.msg').width(contHeight);
    $('.lefter').width(cellWidth).height(marginVer);
    $('.midler').width(cellWidth).height(marginVer);
    $('.rigter').width(cellWidth).height(marginVer);
    $('button').height(linksHeight).width(linksWidth);
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
    $('.msg').css({
        position: 'absolute',
        top: parseInt(height / 2) - parseInt($('#aborted').height() / 2),
        left: parseInt(width / 2) - parseInt(contHeight / 2)
    });
    $('#abortedbtn').css({
        position: 'relative',
        left: parseInt(contHeight / 2) - parseInt(linksWidth / 2)
    });
}