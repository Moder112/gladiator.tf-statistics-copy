// ==UserScript==
// @name         Gladiatortf Quick Copy
// @namespace    http://copy.gladiator.tf/
// @version      0.1
// @description  Copy item acquisiton information
// @author       Moder112
// @match        https://gladiator.tf*/manage/*/item/*
// @match        https://gladiator.tf*/manage/*/statistics
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gladiator.tf
// @grant        none
// ==/UserScript==

// Copied Data is in a format of Item Name, Key Price, Metal Price, Date
// You can reorder the lines commented as such to adjust to your spreadsheet format

$(()=>{
    $('.single-item').each(function(){
        const $add = $(`<button class="btn btn-primary" data-action="update-price">Copy</button>`);
        $that = $(this);

        $add.on('click', function(){
            const payload = [];
            $this = $(this);

            payload.push($('h1').text().trim()); // Item Name 

            payload.push($that.find('.bought-for-keys').text().trim()); // Key Price
            payload.push($that.find('.bought-for-metal').text().trim()); // Metal Price

            const date = $that.find('.time.processed').text().trim().split(',')[0].split('.');
            
            payload.push(date[0]+'/'+date[1]+'/'+date[2]); // Date
            navigator.permissions.query({name: "clipboard-write"}).then(result => {
                console.log(result);
                  if (result.state == "granted" || result.state == "prompt") {
                        console.log(payload.join('\t'))
                      navigator.clipboard.writeText(payload.join('\t'))
                  }
            });


        });

        $(this).find('td').eq(0).append($add);
    });

    const as$ = (set) => {
        const j = [];
        set.each((i, e) => j.push($(e)));
        return j;
    }
    const keyEx = /(\d*(.\d*)?(?= k?))/;
    const refEx = /\d*(.\d*)?(?= ref)/;

    $('.dataTables_wrapper table').on('click', '[role="row"]', function(e) {
        const payload = [];
        const $row = $(this);

        const [$title, $assetid, $bought, $sold, $boughtDate, $soldDate] = as$($row.children());
        const price = $bought.text().trim();
        const date = $boughtDate.text().trim().split(',')[0].split('.');
        const data = [
            $title.text().trim(),
            $assetid.text().trim(),
            (keyEx.exec(price) || [])[0] || 0,
            (refEx.exec(price) || [])[0] || 0,
            date[0]+'/'+date[1]+'/'+date[2]
        ]
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            console.log(result);
            if (result.state == "granted" || result.state == "prompt") {
                console.log(data.join('\t'))
                navigator.clipboard.writeText(data.join('\t'))
            }
        });
    })
});
