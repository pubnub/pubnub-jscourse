

var Util = {

    'updateUserList' : function(pmsg){

        var userlist = document.querySelector("#userlist");
        if((pmsg.action === 'leave') || (pmsg.action === 'timeout')){
            userlist.children.forEach(function(e){
                if(e.attrbutes['uuid'] === uuid){
                    e.className = "offline";
                }
            })
        }else if((pmsg.action === 'join') && (pmsg.data)){

            var li = document.createElement('li');
            var userDiv = document.createElement("div");
            userDiv.className = 'user-presence-container';
            if(pmsg.data){ //
                userDiv.innerHTML = '<p>' + pmsg.data.username + '</p>';
            }

            li.appendChild(userDiv);
            li.setAttribute("class","online");
            userlist.appendChild(li);
        }
    }
}