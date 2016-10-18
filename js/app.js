

var UI = {

    'formatTimeToken': function(timeToken) {
            var date = new Date(timeToken/10000);
            var month = date.getMonth()+1;
            var day = date.getDate();
            var year = date.getFullYear();
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            
            var formattedTime = 
                year + '-' + month + '-' + day + " " + 
                hours + ':' + 
                minutes.substr(minutes.length-2) + ':' + 

                seconds.substr(seconds.length-2);
            return formattedTime;
                                
    },

    'handleLeaveEvent' : function(paction, uuid) {
        var userlist = document.querySelector("#userl");
            console.log('received a ' + paction + ' event');

            if (userlist.children) {
                for (var x=0; x < userlist.children.length; ++x) {
                    var e = userlist.children[x];
                    if (e.getAttribute('data-uuid') === uuid) {
                        //remove the user that is no longer online
                        userlist.removeChild(e);
                    }
                }
            }
    },

    'updateRoomCount' : function(paction, occupancy) {
            var presence = document.querySelector("#presence");

            if (occupancy > 1) {
                presence.innerHTML = '<span class="badge">' + occupancy - 1 + '</span>' + ' others online';
            } 
            else {
                presence.innerHTML = 'Nobody else is online';
            }
    },

    'handleStateChange': function(paction, uuid, userState) {

         var userlist = document.querySelector("#userl");
         var userElement = null;
        
         if (userlist.children !== 'undefined') {
             for (var x=0; x < userlist.children.length; ++x) {
                    var e = userlist.children[x];
                    if (e.getAttribute("data-uuid") === uuid) {
                        userElement = e;
                        break;
                    }
                }
        }

        var userDiv = null;
        var li = null;

        if (userElement != null) {
            console.log('found existing element');
            userDiv = userElement.firstChild;
            li = userElement;
        }
        else {
            li = document.createElement('li');
            userDiv = document.createElement("div");
        }

        userDiv.className = 'user-presence-container';
        if (userState == undefined) {
            userState = {};
            userState.avatar = "";
            userState.username = "anonymous";
        }
        
        userDiv.innerHTML = '<div class="row"><div class="col-sm-2"><i class="' + userState.avatar 
            + '"></i></div><div class="col-sm-8"><h4>' + userState.username + 
            '</h4></div></div> <div class="row"><div class="col-sm-8" align="center">' + userState.location + '</div></div>';

        if (userElement === null) {
            li.appendChild(userDiv);
            li.setAttribute("class","list-group-item online");
            li.setAttribute("data-uuid",uuid);
            userlist.appendChild(li);
        }
    },

    'addChatMessage' : function(messageText, timeStamp, fromUser, avatar) {
        if (!messageText) return; // someone sent data outside of the UI (using REST for example) so ignore it
        var nPanel = document.createElement("div");
        nPanel.className = "panel panel-default";
        
        var nPanelHeader = document.createElement("div");
        nPanelHeader.className = "panel-heading";
        nPanelHeader.innerHTML = 
            '<i class="' + avatar + '"></i>' + '<h3 class="panel-title msg-header">' 
            + fromUser  + ' wrote at: ' + timeStamp + '</h3>';
        
        nPanel.appendChild(nPanelHeader);

        var nPanelContent = document.createElement('div');
        nPanelContent.className = "panel-body";

        var newChatMessage = document.createElement("div");
        newChatMessage.innerHTML = '<p><span>'  + messageText.replace( /[<>]/ig, '' ) + '</span></p>'; 
        newChatMessage.className = "chat-message";

        nPanelContent.appendChild(newChatMessage);
        nPanel.appendChild(nPanelContent);

        var chatMessageLst = document.querySelector("#chat-messages");
        var newChatMessageListItem = document.createElement("li");
        newChatMessageListItem.className = "list-group-item";
        newChatMessageListItem.appendChild(nPanel);
        //append it to the list
        chatMessageLst.appendChild(newChatMessageListItem);


        var div = $("#chat-output")[0];
        // certain browsers have a bug such that scrollHeight is too small
        // when content does not fill the client area of the element
        var scrollHeight = Math.max(div.scrollHeight, div.clientHeight);
        div.scrollTop = scrollHeight - div.clientHeight;

    }     
}