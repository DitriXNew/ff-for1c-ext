(async function() {
    ///////////////////////////////////////////////////////////////////////////
    /// START UP
    ///////////////////////////////////////////////////////////////////////////

    let settings =  {
        serviceUrl: "http://192.168.31.36/httpService/hs/service/activeElement",
        authCredentials: {
          authtype: "Basic",
          username: "admin",
          password: "admin"
        },
        debug: true,
        timeout: 1000
    };

    let headers = new Headers();
    headers.append('Authorization', basicAuthHeader(settings.authCredentials));
    headers.append('Content-Type', 'application/json');

    let previousCoordinates = {};

    function basicAuthHeader(cred) {
        return 'Basic ' + btoa(cred.username + ":" + cred.password);
    }

    async function sendCoordinates(){
        let activeElement = document.activeElement;
        let selectedField = '';

        if(activeElement.classList.contains('gridBody')){
            selectedField = activeElement.querySelector('.select.focus');
        }else if(activeElement.classList.contains('frameCommand')){
            selectedField = activeElement.querySelector('.focus');
        }else if(activeElement.classList.contains('cloud' && 'panelsShadow')){
            selectedField = activeElement.querySelector('.select');
        }else if(activeElement.classList.contains('cloud' && 'cloudBorder')){
            selectedField = activeElement.querySelector('.select');
        }

        activeElement = selectedField ? selectedField : activeElement;

        let currentCoordinates = activeElement.getBoundingClientRect() !== null ? activeElement.getBoundingClientRect() : {};
        if(JSON.stringify(currentCoordinates) === JSON.stringify(previousCoordinates)) {
            setTimeout(() => {
                sendCoordinates()
            }, settings.timeout);
            return;
        }

        if(settings.debug){
            function removeAnimation(){
                activeElement.style.animation = '';
                activeElement.removeEventListener("animationend", removeAnimation);
            }

            activeElement.style.animation = 'blink-bg 0.3s linear 0s 3';
            activeElement.addEventListener("animationend", removeAnimation)
        }
        
        previousCoordinates = currentCoordinates;
    
       let response = await fetch(settings.serviceUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({id: window.document.activeElement.id, currentCoordinates: currentCoordinates})
        });

        let responseText = await response.text()

        let text = document.createElement('span');
        if(activeElement.id){
            text.innerHTML = `${responseText}`;
            text.style.position = "fixed";
            text.style.zIndex = "999999";
            text.style.top = activeElement.getBoundingClientRect().y - 20 +'px';
            text.style.left = activeElement.getBoundingClientRect().x+'px';
            document.body.appendChild(text);
        }
        

        setTimeout(() => {
            sendCoordinates();
            text.remove();
        }, settings.timeout);
    }

    setTimeout(sendCoordinates,settings.timeout);

    function consolelog(e){
        console.log(e.target)
    }

    document.addEventListener('focusin', consolelog)

})();