$(document).ready(function () {
    hoverCard("", "");
    var hoverHTMLDemoHcOverHcMain = '<p>John Resig is an application developer at Khan Academy.He was a JavaScript tool developer</p > ';

    $("#demo-hcOverHc1").hovercard({
        detailsHTML: hoverHTMLDemoHcOverHcMain,
        width: 400,
        cardImgSrc: 'http://ejohn.org/files/short.sm.jpg'
    });
    var hoverHTMLDemoHcOverHcInside = 'Real world javascript techniques for the modern, professional web developer.';
    $("#book").hovercard({
        detailsHTML: hoverHTMLDemoHcOverHcInside,
        width: 300,
        cardImgSrc: 'http://ecx.images-amazon.com/images/I/51wODconOJL._BO2,204,203,200_PIsitb-sticker-arrow-click,TopRight,35,-76_AA300_SH20_OU01_.jpg'
    });
});

function hoverCard(html, img, id) {

    $("#" + id).hovercard({
        // detailsHTML: hoverHTMLDemoHcOverHcMain,
        detailsHTML: html || "Nothing to show",
        width: 400,
        cardImgSrc: img || 'http://ejohn.org/files/short.sm.jpg'
    });
}

