function getAttr(e, t, a) {
    var s = e.split("$"),
        r = /([^{\}]+(?=}))/g;
    for (let e = 0; e < s.length; e++) {
        var i = s[e].split("=");
        if (i[0].trim() == t) return null != (a = i[1]).match(r) && String(a.match(r)).trim()
    }
    return !1
}

function darkModeLogo(e) {
    $("[data-dark-src]").each(function () {
        var t = $(this),
            a = t.data("dark-src"),
            s = t.data("src");
        "true" == e ? t.attr("src", a) : t.attr("src", s)
    })
}

function msgError() {
    return '<span class="error-msg"><b>Error:</b>&nbsp;No Results Found</span>'
}

function beforeLoader() {
    return '<div class="loader"></div>'
}

function getFeedUrl(e, t, a, s) {
    switch (a) {
        case "recent":
            s = "/feeds/posts?limit=" + t;
            break;
        default:
            // " + a + "
            s = "comments" != e ? "/feeds/posts?name=" + a + "&limit=" + t : "/feeds/comments/default?alt=json&max-results=" + t
    }
    return s
}

function getPostID(e, t, a) {
    return a = (a = e[t].id.$t) ? a.split("-").pop() : ""
}

function getPostLink(e, t) {
    for (var a = 0; a < e[t].link.length; a++)
        if ("alternate" == e[t].link[a].rel) {
            var s = e[t].link[a].href;
            break
        } return s
}

function getPostTitle(e, t, a) {
    return e[t].title.$t ? e[t].title.$t : pbt.noTitle
}

function getPostAuthor(e, t, a, s) {
    return s = "" != pbt.postAuthorLabel ? '<span class="sp">' + pbt.postAuthorLabel + "</span>" : "", pbt.postAuthor ? '<span class="entry-author mi">' + s + '<span class="author-name">' + e[t].author[0].name.$t + "</span></span>" : ""
}

function getPostDate(e, t, a, s, r, i) {
    monthNames = "undefined" != typeof monthNames ? monthNames : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], dateFormat = "undefined" != typeof dateFormat ? dateFormat : "{m} {d}, {y}";
    var o = e[t].published.$t,
        n = o.substring(0, 4),
        c = o.substring(5, 7),
        l = o.substring(8, 10),
        d = dateFormat.replace("{m}", monthNames[parseInt(c, 10) - 1]).replace("{d}", l).replace("{y}", n);
    return i = pbt.postAuthor && "" != pbt.postDateLabel ? '<span class="sp">' + pbt.postDateLabel + "</span>" : "", [1 == pbt.postDate ? '<span class="entry-time mi">' + i + '<time class="published" datetime="' + o + '">' + d + "</time></span>" : "", 1 == pbt.postDate ? '<span class="entry-time mi"><time class="published" datetime="' + o + '">' + d + "</time></span>" : ""]
}

function getPostMeta(e, t, a, s, r) {
    return [1 == pbt.postAuthor || 1 == pbt.postDate ? '<div class="entry-meta">' + e + t[0] + "</div>" : "", 1 == pbt.postDate ? '<div class="entry-meta">' + t[1] + "</div>" : ""]
}

function getFirstImage(e) {
    var t = (e = $("<div/>").html(e)).find("img").first().attr("src"),
        a = t.split("/"),
        s = "/" + a.slice(-2)[0];
    return 9 == a.length && (s.match(/\/s[0-9]+/g) || s.match(/\/w[0-9]+/g) || "/d" == s) && (t = t.replace(s, "/w72-h72-p-k-no-nu")), t
}

function getYouTubeImage(e) {
    var t = (e = $("<div/>").html(e)).find("iframe").attr("src").split("/").pop(),
        a = t.split("?");
    return "https://i.ytimg.com/vi/" + (a.length > 1 ? a[0] : t) + "/maxresdefault.jpg"
}

function getPostImage(e, t, a, s) {
    return a = e[t].media$thumbnail ? e[t].media$thumbnail.url : "https://resources.blogblog.com/img/blank.gif"
}

// function getPostImage(e, t, a, s) {
//     var r = e[t].content ? e[t].content.$t : "";
//     return a = e[t].media$thumbnail ? e[t].media$thumbnail.url : "https://resources.blogblog.com/img/blank.gif", r.indexOf(r.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) > -1 ? r.indexOf("<img") > -1 ? r.indexOf(r.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) < r.indexOf("<img") ? a.match("blank.gif") ? getYouTubeImage(r) : a.replace("img.youtube.com", "i.ytimg.com").replace("/default.", "/maxresdefault.") : getFirstImage(r) : a.match("blank.gif") ? getYouTubeImage(r) : a.replace("img.youtube.com", "i.ytimg.com").replace("/default.", "/maxresdefault.") : r.indexOf("<img") > -1 ? getFirstImage(r) : "https://resources.blogblog.com/img/blank.gif"
// }

function getPostImageType(e, t) {
    if (!e) {
        return "is-image"
    }

    return e.match("i.ytimg.com") ? "is-video" : "is-image"
}

function getPostTag(e, t, a, s, r, i) {
    return a = e[t].category ? '<span class="entry-category">' + e[t].category[0].term + "</span>" : "", [1 == pbt.cardTag ? a : "", 1 == pbt.thumbTag ? a : ""]
}

function getPostSummary(e, t, a, s, r, i) {
    return e[t].content && "" != (s = $("<div/>").html(e[t].content.$t).text().trim()) ? '<span class="entry-excerpt excerpt">' + s.substr(0, a) + "</span>" : ""
}

function getPostComments(e, t, a, s, r) {
    var i = e[t].author[0].name.$t,
        o = e[t].author[0].gd$image.src.replace("/s113", "/s72-c").replace("/s220", "/s72-c");
    return (o.match("//img1.blogblog.com/img/blank.gif") || o.match("//img1.blogblog.com/img/b16-rounded.gif")) && (o = "//1.bp.blogspot.com/-QN2lgvtYZco/YN3mUSryAVI/AAAAAAAAADs/KrR-etCcvUMcPl06jopTs9pzq59IAXhMQCLcBGAsYHQ/w72-h72-p-k-no-nu/avatar.jpg"), '<div class="cmm1-item item-' + t + '"><a class="entry-inner" href="' + a + '" title="' + i + '"><span class="entry-image-wrap cmm-avatar"><span class="entry-image" data-src="' + o + '"></span></span><div class="entry-header"><h2 class="entry-title cmm-title">' + i + '</h2><p class="cmm-snippet excerpt">' + s + "</p></div></a></div>"
}

function getPostContent(e, t, a, s) {
    var r = "",
        i = (t.length, getPostLink(t, a)),
        o = getPostTitle(t, a),
        n = getPostAuthor(t, a),
        c = getPostDate(t, a),
        l = getPostImage(t, a),
        d = getPostImageType(l, a),
        m = getPostMeta(n, c),
        g = getPostTag(t, a);
    switch (e) {
        case "mega":
        case "megatabs":
            r += '<div class="mega-item"><a title="' + o + '" class="entry-image-wrap ' + d + '" href="' + i + '"><span class="entry-image" data-src="' + l + '"></span>' + g[1] + '</a><div class="entry-header"><h2 class="entry-title"><a href="' + i + '" title="' + o + '">' + o + "</a></h2>" + m[1] + "</div></div>";
            break;
        case "ticker":
            r += '<div class="ticker-item item-' + a + '"><h2 class="entry-title"><a href="' + i + '" title="' + o + '">' + o + "</a></h2></div>";
            break;
        case "feat1":
        case "feat2":
        case "feat3":
        case "feat4":
        case "feat5":
            switch (a) {
                case 0:
                    r += '<div class="featured-item cs item-' + a + '"><a class="entry-inner" href="' + i + '" title="' + o + '"><span class="entry-image-wrap before-mask ' + d + '"><span class="entry-image" data-src="' + l + '"></span></span><div class="entry-header entry-info">' + g[0] + '<h2 class="entry-title">' + o + "</h2>" + m[0] + "</div></a></div>";
                    break;
                default:
                    r += (1 == a ? '<div class="featured-grid">' : "") + '<div class="featured-item cs item-' + a + '"><a class="entry-inner" href="' + i + '" title="' + o + '"><span class="entry-image-wrap before-mask ' + d + '"><span class="entry-image" data-src="' + l + '"></span></span><div class="entry-header entry-info">' + g[0] + '<h2 class="entry-title">' + o + "</h2>" + ("feat5" == e ? m[0] : m[1]) + "</div></a></div>"
            }
            break;
        case "list1":
        case "related3":
            r += '<div class="' + ("related3" == e ? "related-post list1" : "list1") + "-item item-" + a + '"><a title="' + o + '" class="entry-image-wrap ' + d + '" href="' + i + '"><span class="entry-image" data-src="' + l + '"></span>' + g[1] + '</a><div class="entry-header"><h2 class="entry-title"><a href="' + i + '" title="' + o + '">' + o + "</a></h2>" + getPostSummary(t, a, 96) + m[0] + "</div></div>";
            break;
        case "block1":
        case "block2":
            switch (a) {
                case 0:
                    r += '<div class="' + e + "-item cs item-" + a + '"><a class="entry-inner" href="' + i + '" title="' + o + '"><span class="entry-image-wrap before-mask ' + d + '"><span class="entry-image" data-src="' + l + '"></span></span><div class="entry-header entry-info">' + g[0] + '<h2 class="entry-title">' + o + "</h2>" + m[0] + "</div></a></div>";
                    break;
                default:
                    r += (1 == a ? '<div class="' + e + ("block1" == e ? "-list" : "-grid") + '">' : "") + '<div class="' + e + "-item item-" + a + '"><a title="' + o + '" class="entry-image-wrap ' + ("block1" == e ? "sz-1 " : "sz-3 ") + d + '" href="' + i + '"><span class="entry-image" data-src="' + l + '"></span>' + ("block2" == e ? g[1] : "") + '</a><div class="entry-header"><h2 class="entry-title"><a href="' + i + '" title="' + o + '">' + o + "</a></h2>" + m[1] + "</div></div>"
            }
            break;
        case "grid1":
        case "grid2":
            r += '<div class="' + e + "-item item-" + a + '"><a title="' + o + '" class="entry-image-wrap ' + ("grid2" == e ? "sz-3 " : "") + d + '" href="' + i + '"><span class="entry-image" data-src="' + l + '"></span>' + g[1] + '</a><div class="entry-header"><h2 class="entry-title"><a href="' + i + '" title="' + o + '">' + o + "</a></h2>" + ("grid1" == e ? m[0] : m[1]) + "</div></div>";
            break;
        case "column":
        case "side1":
            switch (a) {
                case 0:
                    r += '<div class="' + ("side1" == e ? "side-item" : "col-item") + " cs item-" + a + '"><a class="entry-inner" href="' + i + '" title="' + o + '"><span class="entry-image-wrap before-mask ' + d + '"><span class="entry-image" data-src="' + l + '"></span></span><div class="entry-header entry-info">' + g[0] + '<h2 class="entry-title">' + o + "</h2>" + m[0] + "</div></a></div>";
                    break;
                default:
                    r += '<div class="' + ("side1" == e ? "side-item" : "col-item") + " item-" + a + '"><a title="' + o + '" class="entry-image-wrap sz-1 ' + d + '" href="' + i + '"><span class="entry-image" data-src="' + l + '"></span></a><div class="entry-header"><h2 class="entry-title"><a href="' + i + '" title="' + o + '">' + o + "</a></h2>" + m[1] + "</div></div>"
            }
            break;
        case "video":
            switch (a) {
                case 0:
                    r += '<div class="video-item cs item-' + a + '"><a class="entry-inner" href="' + i + '" title="' + o + '"><span class="entry-image-wrap before-mask is-video"><span class="entry-image" data-src="' + l + '"></span></span><div class="entry-header entry-info">' + g[0] + '<h2 class="entry-title">' + o + "</h2>" + m[0] + "</div></a></div>";
                    break;
                default:
                    r += (1 == a ? '<div class="video-grid">' : "") + '<div class="video-item item-' + a + '"><a title="' + o + '" class="entry-image-wrap sz-3 is-video" href="' + i + '"><span class="entry-image" data-src="' + l + '"></span></a><div class="entry-header"><h2 class="entry-title"><a href="' + i + '" title="' + o + '">' + o + "</a></h2>" + m[1] + "</div></div>"
            }
            break;
        case "side2":
        case "side3":
            r += '<div class="' + ("side3" == e ? "side3-item" : "side-item") + " item-" + a + '"><a title="' + o + '" class="entry-image-wrap ' + ("side3" == e ? "sz-2 " : "sz-1 ") + d + '" href="' + i + '"><span class="entry-image" data-src="' + l + '"></span>' + ("side3" == e ? g[1] : "") + '</a><div class="entry-header"><h2 class="entry-title"><a href="' + i + '" title="' + o + '">' + o + "</a></h2>" + m[1] + "</div></div>";
            break;
        case "comments":
            r += getPostComments(t, a, i, o);
            break;
        case "related1":
        case "related2":
            a != s - 1 && (r += '<div class="related-post ' + ("related1" == e ? "grid2" : "grid1") + "-item item-" + a + '"><a title="' + o + '" class="entry-image-wrap ' + ("related1" == e ? "sz-3 " : "") + d + '" href="' + i + '"><span class="entry-image" data-src="' + l + '"></span>' + g[1] + '</a><div class="entry-header"><h2 class="entry-title"><a href="' + i + '" title="' + o + '">' + o + "</a></h2>" + ("related1" == e ? m[1] : m[0]) + "</div></div>")
    }
    return r
}

function getRecentPostsData(e, t, a) {
    return $.ajax({
        url: getFeedUrl(e, t, "recent"),
        type: "GET",
        async: !1,
        dataType: "json",
        cache: !0,
        success: function (e) {
            return e
        }
    }).responseJSON
}

function getPosts(e, t, a, s, r) {
    s = 0 != s ? s : "unlabeled", $.ajax({
        url: getFeedUrl(t, a, s),
        type: "GET",
        dataType: "json",
        cache: !0,
        beforeSend: function (a) {
            switch (t) {
                case "mega":
                    e.append('<div class="ul mega-items on-load">' + beforeLoader() + "</div>").addClass("loaded");
                    break;
                case "megatabs":
                    e.html(beforeLoader()).addClass("loaded");
                    break;
                case "ticker":
                case "feat1":
                case "feat2":
                case "feat3":
                case "feat4":
                case "feat5":
                case "list1":
                case "block1":
                case "block2":
                case "grid1":
                case "grid2":
                case "column":
                case "video":
                case "side1":
                case "side2":
                case "side3":
                case "comments":
                case "related1":
                case "related2":
                case "related3":
                    e.html(beforeLoader()).parent().addClass("type-" + t)
            }
        },
        success: function (i) {
            var o = "";
            switch (t) {
                case "mega":
                case "megatabs":
                    o = '<div class="' + ("mega" == t ? "ul " : "") + 'mega-items">';
                    break;
                case "ticker":
                    o = '<div class="ticker-items">';
                    break;
                case "feat1":
                case "feat2":
                case "feat3":
                case "feat4":
                case "feat5":
                    o = '<div class="featured-items">';
                    break;
                case "list1":
                case "block1":
                case "block2":
                case "grid1":
                case "grid2":
                case "column":
                case "video":
                    o = '<div class="content-block ' + t + '-items">';
                    break;
                case "side1":
                case "side2":
                    o = '<div class="side-items">';
                    break;
                case "side3":
                    o = '<div class="side3-items">';
                    break;
                case "comments":
                    o = '<div class="cmm1-items">';
                    break;
                case "related1":
                case "related2":
                case "related3":
                    o = '<div class="related-posts ' + ("related1" == t ? "grid2" : "related2" == t ? "grid1" : "list1") + '-items">'
            }
            var n = i.feed.entry;
            if (n) {
                if ("related1" == t || "related2" == t || "related3" == t) {
                    1 == n.length && "recent" != s && (n = (i = getRecentPostsData(t, a)).feed.entry);
                    for (let e = 0; e < n.length; e++)
                        if (1 != n.length && getPostID(n, e) == r) {
                            n.splice(e, 1);
                            break
                        }
                }
                for (let e = 0, s = n; e < s.length; e++) o += getPostContent(t, s, e, a)
            } else switch (t) {
                case "mega":
                case "megatabs":
                    o = '<div class="' + ("mega" == t ? "ul " : "") + 'mega-items no-items">' + msgError() + "</div>";
                    break;
                default:
                    o = msgError()
            }
            switch (t) {
                case "mega":
                    o += "</div>", e.addClass(t).find(".mega-items").replaceWith(o);
                    break;
                case "ticker":
                    o += "</div>", e.html(o).pbtTicker();
                    break;
                default:
                    o += "</div>", e.html(o)
            }
            switch (t) {
                case "mega":
                case "megatabs":
                    e.find("span.entry-image").pbtLazy({
                        onScroll: !1
                    });
                    break;
                default:
                    e.find("span.entry-image").pbtLazy()
            }
        },
        error: function () {
            switch (t) {
                case "mega":
                    e.find(".mega-items").replaceWith('<div class="ul mega-items no-items">' + msgError() + "</div>");
                    break;
                case "megatabs":
                    e.html('<div class="mega-items no-items">' + msgError() + "</div>");
                    break;
                default:
                    e.html(msgError())
            }
        }
    })
}

function getMega(e, t, a, s) {
    "mega" == t || "megatabs" == t ? getPosts(e, t, a, s) : e.append('<div class="ul mega-items no-items">' + msgError() + "</div>").addClass("loaded")
}

function getTicker(e, t, a, s) {
    if ("ticker" == t) return getPosts(e, t, a, s);
    e.html(msgError())
}

function getFeatured(e, t, a, s) {
    if ("feat1" == t || "feat2" == t || "feat3" == t || "feat4" == t || "feat5" == t) return getPosts(e, t, a, s);
    e.html(msgError())
}

function getBlock(e, t, a, s, r, i) {
    if ("block1" == t || "block2" == t || "grid1" == t || "grid2" == t || "list1" == t || "column" == t || "video" == t) return 0 != s && (r = "recent" == s ? "/search" : "/search/label/" + s, e.parent().find(".widget-title").append('<a href="' + r + '" class="title-link">' + viewAllText + "</a>")), getPosts(e, t, a, s);
    e.html(msgError())
}

function getWidget(e, t, a, s, r) {
    r.match("getposts") && ("side1" == t || "side2" == t || "side3" == t || "comments" == t ? getPosts(e, t, a, s) : e.html(msgError()))
}

function getRelated(e, t, a, s, r) {
    "related1" == t || "related2" == t || "related3" == t ? getPosts(e, t, a, s, r) : e.html(msgError())
}

function megaTabs(e, t) {
    if (0 != t) {
        var a = (t = t.split("/")).length,
            s = '<div class="ul mega-tabs">';
        for (let e = 0; e < a; e++) t[e] && (s += '<div class="mega-tab" data-tab="' + t[e] + '" data-url="/search/label/' + t[e] + '"></div>');
        s += "</div>", e.addClass("megatabs").append(s), e.children("a").on("click", function (e) {
            e.preventDefault()
        });
        var r = e.find(".mega-tab");
        if (r.length) {
            var i;

            function o() {
                e.find(".mega-tab.active").not(".loaded").each(function (e, t) {
                    t = (e = $(this)).data("tab"), getMega(e, "megatabs", 4, t)
                });
                var t = e.find(".mega-tab.loaded");
                r.length == t.length && clearInterval(i)
            }
            e.mouseenter(function () {
                i = setInterval(o, 100)
            }).mouseleave(function () {
                clearInterval(i)
            }), e.find(".mega-tabs").pbtTabs({
                onHover: !0,
                isLinked: !0,
                animated: !1,
                transition: "fadeIn"
            })
        } else e.find(".mega-tabs").replaceWith('<div class="ul mega-items no-items">' + msgError() + "</div>")
    } else e.append('<div class="ul mega-items no-items">' + msgError() + "</div>")
}

function addCustomColor(e, t, a) {
    $("#page-skin-2").length || $("head").append('<style id="page-skin-2" type="text/css"></style>'), $("#page-skin-2").each(function () {
        var s = $(this),
            r = "#" + e,
            i = "";
        switch (t) {
            case "mega":
            case "tabs":
                i = r + "{--main-color:" + a + ";--mega-hover-color:" + a + ";--tag-bg:" + a + "}";
                break;
            case "ticker":
                i = r + "{--main-color:" + a + ";--ticker-title-color:" + a + ";--ticker-hover-color:" + a + ";--tag-bg:" + a + "}";
                break;
            case "feat1":
            case "feat2":
            case "feat3":
            case "feat4":
            case "feat5":
                i = r + "{--main-color:" + a + ";--tag-bg:" + a + "}";
                break;
            default:
                i = r + "{--main-color:" + a + ";--title-hover-color:" + a + ";--tag-bg:" + a + ";--widget-dash-color:" + a + "}"
        }
        s.append(i)
    })
}

function pbtFixedSidebar(e) {
    $(e).each(function (e, t) {
        1 == pbt.fixedSidebar && (25, t = 1 == pbt.fixedMenu ? $(".header-inner").height() + 25 : 25, $(this).theiaStickySidebar({
            containerSelector: "#content-wrapper > .container",
            additionalMarginTop: t,
            additionalMarginBottom: 25
        }))
    })
}

function disqusComments(e) {
    var t = document.createElement("script");
    t.type = "text/javascript", t.async = !0, t.src = "//" + e + ".disqus.com/blogger_item.js", document.getElementsByTagName("head")[0].appendChild(t)
}

function beautiAvatar(e) {
    $(e).attr("src", function (e, t, a) {
        return a = "//1.bp.blogspot.com/-QN2lgvtYZco/YN3mUSryAVI/AAAAAAAAADs/KrR-etCcvUMcPl06jopTs9pzq59IAXhMQCLcBGAsYHQ/s35/avatar.jpg", t = (t = (t = t.replace("//resources.blogblog.com/img/blank.gif", a)).replace("//lh3.googleusercontent.com/zFdxGE77vvD2w5xHy6jkVuElKv-U9_9qLkRYK8OnbDeJPtjSZ82UPq5w6hJ-SA=s35", a)).replace("/s35", "/s39")
    })
}
viewAllText = "undefined" != typeof viewAllText ? viewAllText : pbt.viewAll, $("#magspot-main-menu").pbtMenu(), $(".show-search").click(function (e) {
    e.preventDefault(), $("body").addClass("search-active"), $("#main-search-wrap").fadeIn(170).find("input").focus()
}), $(".search-close").click(function (e) {
    e.preventDefault(), $("body").removeClass("search-active"), $("#main-search-wrap").fadeOut(170).find("input").blur().val("")
}), $("html").each(function () {
    var e = $(this),
        t = localStorage.darkMode;
    1 != pbt.darkMode && 0 != pbt.userDarkMode && ("true" == t && (e.addClass("is-dark"), darkModeLogo(t)), $(".darkmode-toggle").click(function (a) {
        a.preventDefault(), e.toggleClass("is-dark"), t = "true" != t ? "true" : "false", localStorage.darkMode = t, darkModeLogo(t)
    }))
}), $(".dark-logo").each(function () {
    1 == pbt.darkMode && darkModeLogo("true")
}), $("#ticker .PopularPosts .widget-content").pbtTicker(), $(".main-title a.title-link").each(function () {
    "" != viewAllText.trim() && $(this).html(viewAllText)
}), $(".pbt-section .social-icons a").each(function (e) {
    var t = $(this),
        a = t.attr("href").split("#"),
        s = t.data("side");
    a[1] && 1 == s && "" != (e = a[1].trim()) && t.append('<span class="text">' + e + "</span>"), t.attr("href", a[0].trim())
}), $(".MailChimp .widget-content").each(function (e, t) {
    var a = $(this),
        s = a.data("shortcode");
    s && (e = getAttr(s, "title"), t = getAttr(s, "text"), 0 != e && a.find(".mailchimp-title").text(e), 0 != t && a.find(".mailchimp-text").text(t))
}), $(".post-body a").each(function () {
    var e = $(this),
        t = e.text(),
        a = t.toLowerCase(),
        s = getAttr(t, "text");
    a.match("getbutton") && 0 != s && (e.replaceText(/([^{\}]+(?=}))/g, "<em>$1</em>"), e.find("em").replaceText("$", "%s"), e.each(function () {
        var e = $(this),
            t = e.text(),
            a = getAttr(t, "text"),
            s = getAttr(t, "icon"),
            r = getAttr(t, "color"),
            i = getAttr(t, "size"),
            o = getAttr(t, "info"),
            n = e.parent().attr("style");
        e.addClass(0 != i ? "button btn x2" : "button btn").text(a.replace("%s", "$")), n && n.match("center") && e.addClass("is-c"), 0 != o ? (e.addClass(0 != s ? "x2 " + s : "x2"), e.append('<span class="btn-info">' + o.replace("%s", "$") + "</span>")) : 0 != s && e.addClass(s), 0 != r && e.addClass("color").attr("style", "background-color:" + r + ";")
    }))
}), $(".post-body b").each(function () {
    var e = $(this),
        t = e.text(),
        a = t.toLowerCase().trim();
    a.match(/(?:\$ads\=\{1\})/g) && e.replaceWith('<div id="magspot-new-before-ad"/>'), a.match(/(?:\$ads\=\{2\})/g) && e.replaceWith('<div id="magspot-new-after-ad"/>'), a.match("{gettoc}") && (t = 0 != (t = getAttr(t, "title")) ? t : "Table of Contents", e.replaceWith('<div class="pbt-toc-wrap"><div class="pbt-toc-inner"><a href="#" class="pbt-toc-title" role="button" title="' + t + '"><span class="pbt-toc-title-text">' + t + '</span></a><ol id="pbt-toc"></ol></div></div>'), $(".pbt-toc-title").each(function () {
        var e = $(this);
        e.click(function (t) {
            t.preventDefault(), e.toggleClass("is-expanded"), $("#pbt-toc").slideToggle(170)
        })
    }), $("#pbt-toc").toc({
        content: "#post-body",
        headings: "h2,h3,h4"
    }), $("#pbt-toc li a").each(function () {
        var e = $(this);
        e.click(function (t) {
            return t.preventDefault(), $("html,body").animate({
                scrollTop: $(e.attr("href")).offset().top - 20
            }, 500), !1
        })
    })), a.match("{contactform}") && (e.replaceWith('<div class="contact-form-widget"/>'), $("#post-body .contact-form-widget").append($("#ContactForm1 .contact-form-form"))), a.match("{leftsidebar}") && ($("body").addClass("is-left"), e.remove()), a.match("{rightsidebar}") && ($("body").addClass("is-right").removeClass("is-left"), e.remove()), a.match("{fullwidth}") && ($("body").addClass("no-sidebar"), e.remove())
}), $("#magspot-new-before-ad").each(function () {
    var e = $(this);
    e.length && $("#before-ad").appendTo(e)
}), $("#magspot-new-after-ad").each(function () {
    var e = $(this);
    e.length && $("#after-ad").appendTo(e)
}), $("#magspot-main-before-ad .widget").each(function () {
    var e = $(this);
    e.length && e.appendTo($("#before-ad"))
}), $("#magspot-main-after-ad .widget").each(function () {
    var e = $(this);
    e.length && e.appendTo($("#after-ad"))
}), $("#magspot-post-footer-ads .widget").each(function () {
    var e = $(this);
    e.length && e.appendTo($("#post-footer-ads"))
}), $(".post-body blockquote").each(function () {
    var e = $(this),
        t = e.text().toLowerCase().trim(),
        a = e.html();
    if (t.match("{alertsuccess}")) {
        var s = a.replace("{alertSuccess}", "");
        e.replaceWith('<div class="alert-message alert-success">' + s + "</div>")
    }
    if (t.match("{alertinfo}")) {
        s = a.replace("{alertInfo}", "");
        e.replaceWith('<div class="alert-message alert-info">' + s + "</div>")
    }
    if (t.match("{alertwarning}")) {
        s = a.replace("{alertWarning}", "");
        e.replaceWith('<div class="alert-message alert-warning">' + s + "</div>")
    }
    if (t.match("{alerterror}")) {
        s = a.replace("{alertError}", "");
        e.replaceWith('<div class="alert-message alert-error">' + s + "</div>")
    }
    if (t.match("{codebox}")) {
        s = a.replace("{codeBox}", "");
        e.replaceWith('<pre class="code-box">' + s + "</pre>")
    }
}), $(".share-links .pbt-window").click(function (e) {
    e.preventDefault();
    var t = $(this),
        a = t.data("url"),
        s = t.data("width"),
        r = t.data("height");
    window.open(a, "_blank", "scrollbars=yes,resizable=yes,toolbar=0,width=" + s + ",height=" + r + ",top=50,left=50").focus()
}), $(".share-links .show-hid a").click(function (e) {
    e.preventDefault(), $(this).parent().parent().toggleClass("expanded")
}), $(".about-author .author-text").each(function () {
    var e = $(this),
        t = e.find("a");
    t.length && (t.each(function () {
        var e = $(this),
            t = e.text().trim(),
            a = e.attr("href");
        e.replaceWith('<li class="' + t + '"><a class="fa-' + t + '" href="' + a + '" title="' + t + '" rel="noopener noreferrer" target="_blank"/></li>')
    }), e.parent().append('<ul class="author-links social sc-a"></ul>'), e.find("li").appendTo(e.parent().find(".author-links")))
}), $(".main-nav li.mega-menu").each(function (e, t, a, s) {
    var r = $(this),
        i = r.find("a").data("shortcode"),
        o = r.attr("id");
    i && (e = getAttr(i, "label"), t = 0 != (t = getAttr(i, "type")) ? t : "mega", 0 != (s = getAttr(i, "color")) && addCustomColor(o, t, s), "tabs" == t ? megaTabs(r, e) : (0 != e && (a = "recent" == e ? "/search" : "/search/label/" + e, r.children("a").attr("href", a)), r.mouseenter(function () {
        r.hasClass("loaded") || getMega(r, t, 5, e)
    })))
}), $("#ticker .HTML .widget-content").each(function (e, t, a) {
    var s = $(this),
        r = $(window),
        i = s.data("shortcode"),
        o = s.parent().attr("id");
    i && (e = getAttr(i, "results"), t = getAttr(i, "label"), 0 != (a = getAttr(i, "color")) && addCustomColor(o, "ticker", a), r.on("load resize scroll", function a() {
        r.scrollTop() + r.height() >= s.offset().top && (r.off("load resize scroll", a), getTicker(s, "ticker", e, t))
    }).trigger("scroll"))
}), $("#featured .HTML .widget-content").each(function (e, t, a, s) {
    var r = $(this),
        i = $(window),
        o = r.data("shortcode"),
        n = r.parent().attr("id");
    o && (t = getAttr(o, "label"), a = getAttr(o, "style"), e = "feat2" == (a = 0 != a ? "feat" + a : "feat1") || "feat4" == a ? 5 : "feat3" == a || "feat5" == a ? 3 : 4, 0 != (s = getAttr(o, "color")) && addCustomColor(n, a, s), i.on("load resize scroll", function s() {
        i.scrollTop() + i.height() >= r.offset().top && (i.off("load resize scroll", s), getFeatured(r, a, e, t))
    }).trigger("scroll"))
}), $(".content-section .HTML .widget-content").each(function (e, t, a, s, r, i) {
    var o = $(this),
        n = $(window),
        c = o.data("shortcode"),
        l = o.parent().attr("id");
    c && (e = getAttr(c, "results"), t = getAttr(c, "label"), a = getAttr(c, "type"), getAttr(c, "col"), r = 0 != (r = getAttr(c, "style")) ? r : "1", "col-left" != a && "col-right" != a || (o.parent().addClass("column-style").attr("data-align", "col-left" == a ? "left" : "right"), a = "column"), "video" == a && "1" == r && o.parent().addClass("video-style"), 0 != (i = getAttr(c, "color")) && addCustomColor(l, a, i), n.on("load resize scroll", function s() {
        n.scrollTop() + n.height() >= o.offset().top && (n.off("load resize scroll", s), getBlock(o, a, e, t))
    }).trigger("scroll"))
}), $(".pbt-section .HTML .widget-content").each(function (e, t, a, s, r, i) {
    var o = $(this),
        n = $(window),
        c = o.data("shortcode"),
        l = o.data("is"),
        d = o.parent().attr("id");
    c && (e = c.toLowerCase(), t = getAttr(c, "results"), a = getAttr(c, "label"), s = getAttr(c, "type"), r = 0 != (r = getAttr(c, "style")) ? r : "1", s = "posts" != (s = 0 != s ? s : "posts") ? s : "side" + r, l && "footer" == l && (s = "side1" != s ? s : "side2"), 0 != (i = getAttr(c, "color")) && addCustomColor(d, s, i), n.on("load resize scroll", function r() {
        n.scrollTop() + n.height() >= o.offset().top && (n.off("load resize scroll", r), getWidget(o, s, t, a, e))
    }).trigger("scroll"))
}), $("#magspot-related-posts .HTML").each(function (e, t, a) {
    var s = $(this).data("shortcode");
    if (s) {
        function r() {
            return e = getAttr(s, "title"), t = getAttr(s, "results"), a = getAttr(s, "style"), [e, t, a]
        }
        $("#related-wrap").each(function (e, t, a, i, o, n) {
            var c = $(this),
                l = c.find(".related-tag"),
                d = $(window),
                m = c.find(".related-content"),
                g = r(),
                p = c.attr("id");
            e = 0 != g[1] ? Number(g[1]) + 1 : 4, t = l.data("label"), i = 0 != g[2] ? g[2] : "1", a = "related" + i, o = l.data("id"), 0 != (n = getAttr(s, "color")) && addCustomColor(p, a, n), 0 != g[0] && c.find(".related-title .title > span").text(g[0]), d.on("load resize scroll", function s() {
                d.scrollTop() + d.height() >= m.offset().top && (d.off("load resize scroll", s), getRelated(m, a, e, t, o))
            }).trigger("scroll")
        })
    }
}), $(".magspot-blog-post-comments").each(function () {
    var e = $(this),
        t = e.data("shortcode"),
        a = getAttr(t, "type"),
        s = "comments-system-" + a,
        r = e.find("#top-continue .comment-reply");
    switch (a) {
        case "disqus":
            var i = getAttr(t, "shortname");
            0 != i && (disqus_shortname = i), disqusComments(disqus_shortname), e.addClass(s + " is-visible");
            break;
        case "facebook":
            var o = getAttr(t, "lang"),
                n = 0 != o ? "https://connect.facebook.net/" + o + "/all.js#xfbml=1&version=v11.0" : "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v11.0";
            $("head").append('<script async="async" defer="defer" crossorigin="anonymous" src="' + n + '"/>'), e.addClass(s).find("#comments").html('<div class="fb-comments" data-width="100%" data-href="' + disqus_blogger_current_url + '" order_by="time" data-numposts="5" data-lazy="true"></div>'), e.addClass("is-visible");
            break;
        case "hide":
            e.addClass("is-hidden");
            break;
        default:
            e.addClass("comments-system-blogger is-visible"), $(".entry-meta .entry-comments-link").addClass("show"), r.addClass("btn"), beautiAvatar(".avatar-image-container img")
    }
    var c = e.find(".comments .comment-reply"),
        l = e.find(".comments #top-continue"),
        d = e.find(".show-cf");
    c.click(function (t) {
        t.preventDefault(), e.addClass("cf-on"), l.show(), d.remove()
    }), l.click(function (e) {
        e.preventDefault(), l.hide()
    }), d.on("click", function () {
        e.addClass("cf-on"), d.remove(), pbtFixedSidebar("#main-wrapper, #sidebar-wrapper")
    })
}), $(function () {
    $(".entry-image-wrap .entry-image,.author-avatar-wrap .author-avatar").pbtLazy(), $(".mobile-logo").each(function () {
        var e = $(this),
            t = $(".main-logo a").clone();
        t.find("h1").remove(), t.appendTo(e)
    }), $("#mobile-menu").each(function () {
        var e = $(this),
            t = $(".main-nav").clone();
        t.attr("class", "mobile-nav").attr("id", "mobile-nav"), t.find(".mega-menu > .ul").remove(), t.find(".has-sub > a").after('<button class="submenu-toggle" aria-label="expand"/>'), t.find(".mega-menu").not(".megatabs").removeAttr("class").children(".submenu-toggle").remove(), t.find(".mega-menu > a").each(function (e, t, a) {
            var s = $(this),
                r = s.data("shortcode");
            if (r)
                if (e = getAttr(r, "type"), t = getAttr(r, "label"), "tabs" == e) {
                    if (0 != t) {
                        var i = (t = t.split("/")).length,
                            o = '<ul class="sub-menu sm-1">';
                        for (let e = 0; e < i; e++) t[e] && (o += '<li><a href="/search/label/' + t[e] + '">' + t[e] + "</a></li>");
                        o += "</ul>", s.parent().append(o)
                    }
                    s.parent().attr("class", "has-sub"), s.on("click", function (e) {
                        e.preventDefault()
                    })
                } else 0 != t && (a = "recent" == t ? "/search" : "/search/label/" + t, s.attr("href", a))
        }), t.appendTo(e), $(".mobile-menu-toggle, .hide-mobile-menu, .overlay").click(function (e) {
            e.preventDefault(), $("body").toggleClass("nav-active")
        }), $(".mobile-menu .submenu-toggle").click(function () {
            var e = $(this);
            e.parent().hasClass("expanded") ? e.parent().removeClass("expanded").children(".sub-menu").slideToggle(170) : e.parent().addClass("expanded").children(".sub-menu").slideToggle(170)
        })
    }), $(".mm-footer").each(function () {
        var e = $(this),
            t = $("#topbar .LinkList"),
            a = $("#magspot-about-section .LinkList"),
            s = $("#topbar .LinkList"),
            r = $("#footer-menu .LinkList"),
            i = t.length ? t.find("ul.social").clone() : !!a.length && a.find("ul.social").clone();
        0 != i && (i.removeClass("sb-h"), e.append(i)), $m = s.length ? s.find("ul.link-list").clone() : !!r.length && r.find("ul.link-list").clone(), 0 != $m && e.append($m)
    }), $(".header-inner").each(function () {
        var e = $(this);
        if (1 == pbt.fixedMenu && e.length > 0) {
            var t = $(document).scrollTop(),
                a = e.offset().top,
                s = e.height(),
                r = a + s + s;
            $(window).scroll(function (s) {
                (s = $(document).scrollTop()) > r ? e.addClass("is-fixed") : (s < a || s <= 1) && e.removeClass("is-fixed"), s < t ? setTimeout(function () {
                    e.addClass("show")
                }, 170) : e.removeClass("show"), t = s
            })
        }
    }), pbtFixedSidebar("#main-wrapper, #sidebar-wrapper"), $("#post-body iframe").each(function () {
        var e = $(this);
        e.attr("src").match("www.youtube.com") && e.wrap('<div class="youtube-video"/>')
    }), $("p.comment-content").each(function () {
        var e = $(this);
        e.replaceText(/(https:\/\/\S+(\.png|\.jpeg|\.jpg|\.gif))/g, '<img src="$1"/>'), e.replaceText(/(?:https:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:watch\?v=)?(.+)/g, '<div class="youtube-video"><iframe id="youtube" width="100%" height="358" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>')
    }), $("#magspot-load-more-link").each(function () {
        var e = $(this),
            t = e.data("load");
        t && e.show(), e.click(function (a) {
            a.preventDefault(), e.hide(), $.ajax({
                url: t,
                success: function (a) {
                    var s = $(a).find(".blog-posts");
                    s.find(".index-post").addClass("fadeInUp"), $(".blog-posts").append(s.html()), (t = $(a).find("#magspot-load-more-link").data("load")) ? e.show() : (e.hide(), $("#blog-pager .no-more").addClass("show"))
                },
                beforeSend: function () {
                    $("#blog-pager .loading").show()
                },
                complete: function () {
                    $("#blog-pager .loading").hide(), $(".index-post .entry-image-wrap .entry-image").not(".pbt-lazy").pbtLazy(), pbtFixedSidebar("#main-wrapper, #sidebar-wrapper")
                }
            })
        })
    }), $("#magspot-cookie-consent").each(function () {
        var e = $(this),
            t = e.find(".widget.Text").data("shortcode"),
            a = e.find(".consent-button");
        e.length > 0 && (t && (ok = getAttr(t, "ok"), days = getAttr(t, "days"), 0 != ok && a.text(ok), days = 0 != days ? Number(days) : 7), "1" !== $.cookie("magspot_cookie_consent") && (e.css("display", "block"), $(window).on("load", function () {
            e.addClass("is-visible")
        })), a.off("click").click(function (t) {
            t.preventDefault(), t.stopPropagation(), $.cookie("magspot_cookie_consent", "1", {
                expires: days,
                path: "/"
            }), e.removeClass("is-visible"), setTimeout(function () {
                e.css("display", "none")
            }, 500)
        }), cookieChoices = {})
    }), $("#back-top").each(function () {
        var e = $(this);
        $(window).on("scroll", function () {
            $(this).scrollTop() >= 100 ? e.addClass("show") : e.removeClass("show"), e.offset().top >= $("#footer-wrapper").offset().top - 34 ? e.addClass("on-footer") : e.removeClass("on-footer")
        }), e.click(function (e) {
            e.preventDefault(), $("html, body").animate({
                scrollTop: 0
            }, 500)
        })
    })
});