/**
 * 背景音乐播放组件
 * @author 叶晓毅
 * @version 1.0.0
 */
var AudioPlayer;

AudioPlayer = (function() {
  'use strict';
  var player;
  function AudioPlayer(options) {
    'use strict';

    this.musics = options.musics || [];
    this.auto = options.auto || false;
    this.currect = -1;
    this.Urls = [];
    this.currentAudio = null;

    for(var i = 0,length = this.musics.length; i < length; i++){
      if(this.musics[i]){
        this.Urls.push(this.musics[i]);
      }
    }



    this.currentAudio = new Audio();
    this.currentAudio.addEventListener('ended', load);
    
    this.length = this.Urls.length;

    player = this;

    if(this.auto){
      load();
      $(document).one('touchstart',function(){
        player.currentAudio.play();
      });
    }
  };

  function load(){
    'use strict';

    var url, nextAudio;
    if(player.length === 0){
      return;
    }
    player.currect++;
    player.currect = player.currect % player.length;
    url = player.Urls[player.currect];
    if(url) {
      player.currentAudio.setAttribute('src', url);
      player.currentAudio.play();
    }
  }

  // AudioPlayer.prototype.isPaused = function(){
  //   if(!player.currentAudio){
  //     return true;
  //   }
  //   return player.currentAudio.paused;
  // }


  AudioPlayer.prototype.switch = function() {
    'use strict';

    if(this.currect === -1){
      load();
      return true;
    }
    var paused = this.currentAudio.paused;
    if(paused){
      this.currentAudio.play();
      return true;
    }
    this.currentAudio.pause();
    return false;
  };

  return AudioPlayer;

})();