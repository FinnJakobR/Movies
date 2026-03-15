

//man muss http request machen damit ich ne file lesen kann! Internet ist toll
export async function readFile(path) {
    const res = await fetch(path);
    if(!res.ok) throw Error("[File Read Error]: " + res.statusText);
    return await res.text();
};

export function randomAngle() {
  return Math.random() * Math.PI * 2;
}

const degToRad = deg => deg * Math.PI / 180;

export const getSmallRotation = () =>
    degToRad((Math.random() - 0.5) * 5); // ±2.5°


export async function download_image(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.crossOrigin = "anonymous";

        img.onload = () => {
            resolve(img);
        };

        img.onerror = (err) => {
            reject(err);
        };
    });
}

export function isMobile() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /Intel Mac OS X/.test(a))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };


export function isPhone(){
    let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}


  export function cutTextAtNearestSentence(text, target = 400) {
  if (text.length <= target) return text;

  // Alle Satzendzeichen finden
  const regex = /[.!?]/g;
  let match;
  const positions = [];

  while ((match = regex.exec(text)) !== null) {
    positions.push(match.index);
  }

  if (positions.length === 0) {
    return text.slice(0, target);
  }

  // Nächstgelegenen Punkt zu target finden
  let closestIndex = positions[0];

  for (const pos of positions) {
    if (Math.abs(pos - target) < Math.abs(closestIndex - target)) {
      closestIndex = pos;
    }
  }

  return text.slice(0, closestIndex + 1);
}

//2026-02-08T12:25:58.639Z

export function formateDate(date) {



    const formatted = new Intl.DateTimeFormat(navigator.language, {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit'
    }).format(date).replace("/", ".").replace(',', ' /');

    return formatted;
}


export function searchTag(e) {
    const title = e.target.innerText;
    console.log(title);
    saveSessionStorage("search_value", title);
    location.reload();
}


export function deleteSessionStorage(key){
  window.sessionStorage.removeItem(key);
}

export function saveSessionStorage(key, str) {
  window.sessionStorage.setItem(key, str);
}


export function changeDetailScreenData(data) {


    if(typeof data.release === 'string') {
      data.release = new Date(data.release);
    }


    document.getElementById("runtime").innerText = data.duration;
    document.getElementById("story").children[0].innerText =  cutTextAtNearestSentence(data.story, 400);
    document.getElementById("film_rating").innerText = `${data.rating} / 10`;
    document.getElementById("release_date").innerText = `${formateDate(data.release)}`

    const year = data.release.getFullYear();
    const director = data.director;

    const directorDom = document.getElementById("Director");
    const yearDom = document.getElementById("year");


    yearDom.children[0].children[0].innerText = year;
    directorDom.children[0].children[0].innerText = director.name;


    directorDom.addEventListener("click", searchTag);

    yearDom.addEventListener("click", searchTag)



    const tags = data.tags.map((e) => e.name);


    const tagNode = document.getElementById("tags");

    if(tagNode.childNodes.length > 0) {

      const childTags = Array.from(tagNode.childNodes);

      for(const childTag of childTags) {
          childTag.remove();
          childTag.removeEventListener("click", searchTag);
      }

    }

    for(const tag of tags) {
        const d = document.createElement("div");
        const a = document.createElement("a");
        a.classList.add("tag_url");
        a.innerText = tag;
        d.appendChild(a);

        tagNode.appendChild(d);
        a.addEventListener("click", searchTag);
    }

    document.getElementById("article_title").innerText = data.articleTitle;
    document.getElementById("article").getElementsByClassName("infos_main_text")[0].innerText = data.article;

    




}

export function getSafeAreaInsets() {
  const style = getComputedStyle(document.documentElement);

  if(!isPhone()) {

    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }

  }

  return {
    top: parseFloat(style.getPropertyValue('--safe-top')) || 60,
    bottom: parseFloat(style.getPropertyValue('--safe-bottom')) || 50,
    left: parseFloat(style.getPropertyValue('--safe-left')) || 30,
    right: parseFloat(style.getPropertyValue('--safe-right')) || 30,
  };
}
