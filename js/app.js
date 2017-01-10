var UI = {

    'addChatMessage' : function(messageText, timeStamp, fromUser) {
        if (!messageText) return; // someone sent data outside of the UI (using REST for example) so ignore it
        var nPanel = document.createElement("div");
        nPanel.className = "panel panel-default";
        
        var nPanelHeader = document.createElement("div");
        nPanelHeader.className = "panel-heading";
        nPanelHeader.innerHTML = '<h3 class="panel-title msg-header">' + fromUser  + ' wrote at: ' + timeStamp + '</h3>';
        
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

    },

    'clearBuddyList' : function(event) {
        var userlist = document.querySelector("#buddy-list");
        
        if (userlist.children) {
            for (var x=0; x <= userlist.children.length; ++x) {
                var e = userlist.children[0];
                userlist.removeChild(e);
            }
        }

        UI.updateRoomCount(0);
    },

    'handleLeaveEvent' : function(event) {
        console.log('received a ' + event.action + ' event');        
        var userElement = document.querySelector("#" + event.uuid)

        if (userElement != undefined) {
            console.log('removing uuid: ' + event.uuid);
            userElement.remove();
        }

        UI.updateRoomCount(event.occupancy);
    },

    'handleStateChange': function(uuid, state) {
        try {
            var userlist = document.querySelector("#buddy-list");
            var userElement = document.querySelector("#" + uuid);
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
            if (state == undefined) {
                state = {};
                state.username = "anonymous";
            }
            
            userDiv.innerHTML = '<div class="row"><div class="col-sm-8"><h4>' + state.username + 
                '</h4></div></div> <div class="row"><div class="col-sm-8 location">' + state.location + '</div></div>';

            if (userElement === null) {
                li.appendChild(userDiv);
                li.setAttribute("class","list-group-item online");
                // li.setAttribute("data-uuid", uuid);
                li.setAttribute("id", uuid);
                userlist.appendChild(li);
            }
        } // try
        catch (err) {
            // couldn't find element with id
            // do nothing
        }
    },

    'updateRoomCount' : function(occupancy) {
        var presence = document.querySelector("#presence");
        presence.innerHTML = '<span class="badge">Total Participants: ' + occupancy + '</span>';
    },

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
    }
}