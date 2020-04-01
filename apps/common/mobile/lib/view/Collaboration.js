/*
 *
 * (c) Copyright Ascensio System SIA 2010-2019
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

/**
 *  Collaboration.js
 *
 *  Created by Julia Svinareva on 12/7/19
 *  Copyright (c) 2019 Ascensio System SIA. All rights reserved.
 *
 */

if (Common === undefined)
    var Common = {};

Common.Views = Common.Views || {};

define([
    'text!common/mobile/lib/template/Collaboration.template',
    'jquery',
    'underscore',
    'backbone'
], function (settingsTemplate, $, _, Backbone) {
    'use strict';

    Common.Views.Collaboration = Backbone.View.extend(_.extend((function() {
        // private

        return {

            template: _.template(settingsTemplate),

            events: {
                //
            },

            initialize: function() {
                Common.NotificationCenter.on('collaborationcontainer:show', _.bind(this.initEvents, this));
                this.on('page:show', _.bind(this.updateItemHandlers, this));
            },

            initEvents: function () {
                var me = this;

                Common.Utils.addScrollIfNeed('.view[data-page=collaboration-root-view] .pages', '.view[data-page=collaboration-root-view] .page');
                me.updateItemHandlers();
            },

            initControls: function() {
                //
            },

            // Render layout
            render: function() {
                this.layout = $('<div/>').append(this.template({
                    android : Common.SharedSettings.get('android'),
                    phone   : Common.SharedSettings.get('phone'),
                    orthography: Common.SharedSettings.get('sailfish'),
                    scope   : this,
                    editor  : !!window.DE ? 'DE' : !!window.PE ? 'PE' : 'SSE'
                }));

                return this;
            },

            updateItemHandlers: function () {
                var selectorsDynamicPage = [
                    '.page[data-page=collaboration-root-view]',
                    '.page[data-page=reviewing-settings-view]'
                ].map(function (selector) {
                    return selector + ' a.item-link[data-page]';
                }).join(', ');

                $(selectorsDynamicPage).single('click', _.bind(this.onItemClick, this));
            },

            onItemClick: function (e) {
                var $target = $(e.currentTarget),
                    page = $target.data('page');

                if (page && page.length > 0 ) {
                    this.showPage(page);
                }
            },

            rootLayout: function () {
                if (this.layout) {
                    var $layour = this.layout.find('#collaboration-root-view'),
                        isPhone = Common.SharedSettings.get('phone');

                    return $layour.html();
                }

                return '';
            },

            showPage: function(templateId, animate) {
                var me = this;
                var prefix = !!window.DE ? DE : !!window.PE ? PE : SSE;
                var rootView = prefix.getController('Common.Controllers.Collaboration').rootView();


                if (rootView && this.layout) {
                    var $content = this.layout.find(templateId);

                    // Android fix for navigation
                    if (Framework7.prototype.device.android) {
                        $content.find('.page').append($content.find('.navbar'));
                    }

                    rootView.router.load({
                        content: $content.html(),
                        animatePages: animate !== false
                    });

                    this.fireEvent('page:show', [this, templateId]);
                }
            },

            //Comments

            renderViewComments: function(comments, indCurComment) {
                var isAndroid = Framework7.prototype.device.android === true;
                if ($('.view-comment .page-content').length > 0) {
                    var template = '';
                    if (comments && comments.length > 0) {
                        template = '<div class="list-block">' +
                            '<ul id="comments-list">';
                        var comment = comments[indCurComment];
                        template += '<li class="comment item-content" data-uid="' + comment.uid + '">' +
                            '<div class="item-inner">' +
                            '<div class="header-comment"><div class="comment-left">';
                        if (isAndroid) {
                            template += '<div class="initials-comment" style="background-color: ' + comment.usercolor + ';">' + comment.userInitials + '</div><div>';
                        }
                        template += '<p class="user-name">' + comment.username + '</p>' +
                            '<p class="comment-date">' + comment.date + '</p>';
                        if (isAndroid) {
                            template += '</div>';
                        }
                        template += '</div>';
                        template += '<div class="comment-right">' +
                            '<div class="comment-resolve"><i class="icon icon-resolve-comment' + (comment.resolved ? ' check' : '') + '"></i></div>' +
                            '<div class="comment-menu"><i class="icon icon-menu-comment"></i></div>' +
                            '</div>' +
                            '</div>';

                        if (comment.quote) template += '<p class="comment-quote" data-ind="' + comment.uid + '">' + comment.quote + '</p>';
                        template += '<div class="comment-text"><span>' + comment.comment + '</span></div>';
                        if (comment.replys.length > 0) {
                            template += '<ul class="list-reply">';
                            _.each(comment.replys, function (reply) {
                                template += '<li class="reply-item" data-ind="' + reply.ind + '">' +
                                    '<div class="header-reply">' +
                                    '<div class="reply-left">';
                                if (isAndroid) {
                                    template += '<div class="initials-reply" style="background-color: ' + reply.usercolor + ';">' + reply.userInitials + '</div><div>'
                                }
                                template += '<p class="user-name">' + reply.username + '</p>' +
                                    '<p class="reply-date">' + reply.date + '</p>' +
                                    '</div>';
                                if (isAndroid) {
                                    template += '</div>';
                                }
                                template += '<div class="reply-menu"><i class="icon icon-menu-comment"></i></div>' +
                                    '</div>' +
                                    '<p class="reply-text">' + reply.reply + '</p>' +
                                    '</li>';
                            });
                            template += '</ul>'
                        }

                        template += '</div>' +
                            '</li>';
                        template += '</ul></div>';
                        $('.view-comment .page-content').html(template);
                    }
                }
                Common.Utils.addScrollIfNeed('.view-comment.page', '.view-comment .page-content');
            },

            renderComments: function (comments) {
                var $pageComments = $('.page-comments .page-content');
                if (!comments) {
                    if ($('.comment').length > 0) {
                        $('.comment').remove();
                    }
                    var template = '<div id="no-comments" style="text-align: center; margin-top: 35px;">' + this.textNoComments + '</div>';
                    $pageComments.append(_.template(template));
                } else {
                    if ($('#no-comments').length > 0) {
                        $('#no-comments').remove();
                    }
                    var $listComments = $('#comments-list'),
                        items = [];
                    _.each(comments, function (comment) {
                        var itemTemplate = [
                            '<li class="comment item-content" data-uid="<%= item.uid %>">',
                            '<div class="item-inner">',
                            '<div class="header-comment"><div class="comment-left">',
                            '<% if (android) { %><div class="initials-comment" style="background-color:<%= item.usercolor %> "> <%= item.userInitials %></div><div><% } %>',
                            '<p class="user-name"><%= item.username %></p>',
                            '<p class="comment-date"><%= item.date %></p>',
                            '<% if (android) { %></div><% } %>',
                            '</div>',
                            '<div class="comment-right">',
                            '<div class="comment-resolve"><i class="icon icon-resolve-comment <% if (item.resolved) { %> check <% } %>"></i></div>',
                            '<div class="comment-menu"><i class="icon icon-menu-comment"></i></div>',
                            '</div>',
                            '</div>',
                            '<% if(item.quote) {%>',
                            '<p class="comment-quote" data-id="<%= item.uid %>"><%= item.quote %></p>',
                            '<% } %>',
                            '<p class="comment-text"><span><%= item.comment %></span></p>',
                            '<% if(replys > 0) {%>',
                            '<ul class="list-reply">',
                            '<% _.each(item.replys, function (reply) { %>',
                            '<li class="reply-item" data-ind="<%= reply.ind %>">',
                                '<div class="header-reply">',
                                    '<div class="reply-left">',
                                        '<% if (android) { %><div class="initials-reply" style="background-color: <%= reply.usercolor %>;"><%= reply.userInitials %></div><div><% } %>',
                                        '<p class="user-name"><%= reply.username %></p>',
                                        '<p class="reply-date"><%= reply.date %></p>',
                                    '</div>',
                                    '<% if (android) { %></div><% } %>',
                                    '<div class="reply-menu"><i class="icon icon-menu-comment"></i></div>',
                                '</div>',
                                 '<p class="reply-text"><%= reply.reply %></p>',
                            '</li>',
                            '<% }); %>',
                            '</ul>',
                            '<% } %>',
                            '</div>',
                            '</li>'
                        ].join('');
                        items.push(_.template(itemTemplate)({
                            android: Framework7.prototype.device.android,
                            item: comment,
                            replys: comment.replys.length,
                        }));
                    });
                    $listComments.html(items.join(''));
                }
            },

            renderEditComment: function(comment) {
                var $pageEdit = $('.page-edit-comment .page-content');
                var isAndroid = Framework7.prototype.device.android === true;
                var template = '<div class="wrap-comment">' +
                    (isAndroid ? '<div class="header-comment"><div class="initials-comment" style="background-color: ' + comment.usercolor + ';">' + comment.userInitials + '</div><div>' : '') +
                    '<div class="user-name">' + comment.username + '</div>' +
                    '<div class="comment-date">' + comment.date + '</div>' +
                    (isAndroid ? '</div></div>' : '') +
                    '<div><textarea id="comment-text" class="comment-textarea">' + comment.comment + '</textarea></div>' +
                    '</div>';
                $pageEdit.html(_.template(template));
            },

            renderAddReply: function(name, color, initials, date) {
                var $pageAdd = $('.page-add-reply .page-content');
                var isAndroid = Framework7.prototype.device.android === true;
                var template = '<div class="wrap-reply">' +
                    (isAndroid ? '<div class="header-comment"><div class="initials-comment" style="background-color: ' + color + ';">' + initials + '</div><div>' : '') +
                    '<div class="user-name">' + name + '</div>' +
                    '<div class="comment-date">' + date + '</div>' +
                    (isAndroid ? '</div></div>' : '') +
                    '<div><textarea class="reply-textarea">' + '</textarea></div>' +
                    '</div>';
                $pageAdd.html(_.template(template));
            },

            renderEditReply: function(reply) {
                var $pageEdit = $('.page-edit-reply .page-content');
                var isAndroid = Framework7.prototype.device.android === true;
                var template = '<div class="wrap-comment">' +
                    (isAndroid ? '<div class="header-comment"><div class="initials-comment" style="background-color: ' + reply.usercolor + ';">' + reply.userInitials + '</div><div>' : '') +
                    '<div class="user-name">' + reply.username + '</div>' +
                    '<div class="comment-date">' + reply.date + '</div>' +
                    (isAndroid ? '</div></div>' : '') +
                    '<div><textarea id="comment-text" class="edit-reply-textarea">' + reply.reply + '</textarea></div>' +
                    '</div>';
                $pageEdit.html(_.template(template));
            },

            textCollaboration: 'Collaboration',
            textReviewing: 'Review',
            textСomments: 'Сomments',
            textBack: 'Back',
            textReview: 'Track Changes',
            textAcceptAllChanges: 'Accept All Changes',
            textRejectAllChanges: 'Reject All Changes',
            textDisplayMode: 'Display Mode',
            textMarkup: 'Markup',
            textFinal: 'Final',
            textOriginal: 'Original',
            textChange: 'Review Change',
            textEditUsers: 'Users',
            textNoComments: "This document doesn\'t contain comments",
            textEditСomment: "Edit Comment",
            textDone: "Done",
            textAddReply: "Add Reply",
            textEditReply: "Edit Reply"
        }
    })(), Common.Views.Collaboration || {}))
});