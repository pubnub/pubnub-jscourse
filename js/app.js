

var UI = {

    'updateUserList' : function(pmsg, defaultState){

        var userlist = document.querySelector("#userl");
        if((pmsg.action === 'leave') || (pmsg.action === 'timeout')){
            if(userlist.children){
                userlist.children.forEach(function(e){
                    if(e.attrbutes['data-uuid'] === uuid){
                        e.className = "list-group-item offline";
                        //remove the user that is no longer online
                        userlist.children.removeChild(e);
                    }
                });
            }
        }else if(pmsg.action === 'join'){

            var li = document.createElement('li');
            var userDiv = document.createElement("div");
            userDiv.className = 'user-presence-container';
            if(pmsg.data){ //
                userDiv.innerHTML = '<p>' + pmsg.data.username + '</p>';
            }else{ //its a join event for your self. You could set state here as well.
                userDiv.innerHTML = '<p>' + defaultState.username;
            }

            li.appendChild(userDiv);
            li.setAttribute("class","list-group-item online");
            li.setAttribute("data-uuid",pmsg.uuid);
            userlist.appendChild(li);
        }
    },


    'updateUserState': function(){

    }
}