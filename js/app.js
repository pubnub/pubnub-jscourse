

var UI = {

    'updateUserList' : function(pmsg, defaultState){

        var userlist = document.querySelector("#userl");
        if((pmsg.action === 'leave') || (pmsg.action === 'timeout')){
            userlist.children.forEach(function(e){
                if(e.attrbutes['uuid'] === uuid){
                    e.className = "list-group-item offline";
                }
            })
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
            userlist.appendChild(li);
        }
    },


    'updateUserState': function(){

    }
}