/**
 * blog.js - the core of silentor
 * author: Jayin Ton
 * version: 1.5.3
 * License:Apache 2.0
 */
(function($) {
    var app_name = '';
    var blog_base = '';
    var img_root = 'img';
    var markdown_root = 'p';
    //当前请求的markdown文件
    var cur_md_path = '';
    /*是否是http:// 如果是，那么这是资源文件,如果否，说明这是要处理的a标签*/
    function isAbsolute(url) {
        return url.indexOf('//') !== -1;
    }
    /*获得相对目录*/
    function getPageBase(url) {
        return url.slice(0, url.lastIndexOf('/') + 1);
    }
    /*判断加载的路径是否是markdown文件*/
    function isMarkdownFile(url) {
        return url.toLowerCase().indexOf('.md') !== -1 || url.toLowerCase().indexOf('.markdown') !== -1;
    }
    //获得markdown的文件名,用作标题
    function getMarkdownTitle(file_path) {
        if (!isMarkdownFile(file_path)) {
            return app_name;
        } else {
            var real_file_name = file_path;
            if (hasFolder(file_path)) {
                real_file_name = file_path.slice(file_path.lastIndexOf('/') + 1, file_path.length);
            }
            return real_file_name.split('.')[0];
        }
    }
    // resolve 路径
    function resolvePath(from, to) {
        if (from[from.length-1] == '/') {
            from = from.substring(0, from.length-1);
        }
        var froms = from.split('/');
        var tos = to.split('/');
        if (tos[0] == '.') {
            tos.splice(0, 1);
        } else if (tos[0] == '..') {
            froms.splice(froms.length-1, 1);
            tos.splice(0, 1);
        } else if (tos[0].indexOf('http') != -1 || tos[0].indexOf('https') != -1) {
            return to;
        } else {
            return froms.join('/') + "/" + tos.join('/');
        }
        return resolvePath(froms.join('/'), tos.join('/'));
    }
        /**
         * @param selector 选择器
         * @param  file_path 文件路径
         * @param  isSidebar 是否是左边导航栏
         * @param  baseUrl 基准url
         */
    function load(selector, file_path, isSidebar, baseUrl) {
        baseUrl = baseUrl || blog_base;
        isSidebar = isSidebar || false;

        p_url = baseUrl + file_path;
        // console.log(getPageBase(p_url));


        $.get(p_url, function(data) {
            marked.setOptions({
                highlight: function(code) {
                    return hljs.highlightAuto(code).value;
                }
            });
            var _selector = $(selector);
            _selector.html(marked(data));

            //处理所有scr
            _selector.find('[href]').each(function() {
                var $element = $(this);
                var url = $element.attr('href');

                if (isAbsolute(url)) {
                    $element.attr('target', '_blank');
                }

                // sidebar
                if (isSidebar && isMarkdownFile(url)) {
                    $element.attr('href', '?' + url);

                }

                //main page
                if (!isAbsolute(url) && !isSidebar && isMarkdownFile(url)) {
                    var path = resolvePath(getPageBase(cur_md_path), url);
                    $element.attr('href', '?' + path);
                }
            });
            //main-page
            if (!isSidebar) {
                //change title
                var mainTitle = $('#main-page').find('h1, h2, h3, h4, h5, h6').first().text();
                $('title').text(mainTitle);

                //图片位置
                $.each(_selector.find('img'), function(index, item) {
                    var alt = $(item).attr('alt') || '';
                    if (alt.indexOf('|left') != -1) {
                        $(item).addClass('img-left');
                    } else if (alt.indexOf('|right') != -1) {
                        $(item).addClass('img-right');
                    } else {
                        $(item).addClass('img-center');
                    }
                    var src = $(item).attr('src');
                    var path = resolvePath(getPageBase(p_url), src);
                    $(item).attr('src', path);
                });
            }
            //sidebar
            if (isSidebar) {
                //round avatar
                _selector.find('img').first().addClass('avatar');
                //add animation in item
                $.each(_selector.find('li'), function(index, item) {
                    $(item).addClass('sidebar-item');
                });
            }
            //处理图片链接
            // $.each(_selector.find('img'), function(index, item) {
            //     $e = $(item);
            //     if ($e.attr('src').indexOf('__IMG__') == 0) {
            //         $e.attr('src', $e.attr('src').replace('__IMG__', img_root));
            //     }
            // });

        }).fail(function(err) {
            if (err.status === 404) {
                if (file_path === 'footer.md') {
                    console.log('没有找到footer.md! 建议在p/目录下建立footer.md 文件来添加底部信息！');
                    return;
                }
                load('#main-page', '404.md', false, '/' + app_name + '/');
            }
        });
    }

    function read_config(callback) {
        $.getJSON('config.json', {}, function(data) {
            app_name = data.app_name || app_name;
            img_root = data.img_root || img_root;
            description = data.description || "";

            markdown_root = data.markdown_root || markdown_root;
            blog_base = '/' + app_name + '/' + markdown_root + '/';

            $('meta[name=description]').first().attr('content',description);
            callback();
        }).fail(function(err) {
            alert('读取配置有误');
        });
    }

    function main() {
        read_config(function() {
            //加载侧边菜单栏
            load('#sidebar-page', 'sidebar.md', true);
            load('#sidebar-header', 'sidebarheader.md', true);
            load('#main-page-footer', 'footer.md');
            //加载主内容页
            if (location.search.indexOf('&') !== -1) {
                cur_md_path = location.search.slice(1, location.search.indexOf('&'));
            } else {
                cur_md_path = location.search.slice(1, location.search.length);
            }
            //部分服务器会在后面追加'/',例如：?a/b/cxx.md/
            if(cur_md_path.charAt(cur_md_path.length - 1) === '/'){
                cur_md_path = cur_md_path.slice(0, location.search.length - 2);
            }
            if (cur_md_path === '' || !isMarkdownFile(cur_md_path)) {
                load('#main-page', 'home.md');
            } else {
                load('#main-page', cur_md_path);
            }
        });
    }

    main();
    
})(jQuery);
