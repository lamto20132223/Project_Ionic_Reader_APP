import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides, ViewController} from 'ionic-angular';
import {PatternPhonic2Service} from "../../../providers/pattern-phonic2-service";
import {AudioPlayer} from "../../../providers/audio";
import {OptionService} from "../../../providers/option-service";
import {SighWordsPage} from "../sigh-words/sigh-words";
import {LessonPage} from "../../lesson/lesson";
import {ImageService} from "../../../providers/image-service";

/*
 Generated class for the PatternPhonic page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-pattern-phonic2',
  templateUrl: 'pattern-phonic2.html'
})
export class PatternPhonic2Page {
  bg_image_above: string;
  bg_image_slide:string;
  back_img:string;
  volume_img:string;
  level:number;
  @ViewChild(Slides) slides: Slides;
  firstItem: {text: String, fileAudioName: String,color:String};
  items: Array<{id: number, textFirst: String,textSecond:String, filename: String}>;
  colorFirst:String;
  colorSecond:String;
  isPlaying: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private patternphonic: PatternPhonic2Service, private audio: AudioPlayer, private option: OptionService,public viewCtrl: ViewController, private imageService:ImageService) {
    this.bg_image_above=imageService.getImageXHDPIV4("questions_bg_2.png");
    this.bg_image_slide =imageService.getImageXHDPIV4("questions_board_2.png");
    this.back_img = imageService.getImageXHDPIV4("back.png");
    this.volume_img = imageService.getImageXHDPIV4("sound_on.png");
    this.colorFirst =option.getRandomColor();
    this.colorSecond = option.getRandomColor();
    this.firstItem = {text: "MÔ HÌNH NGỮ ÂM", fileAudioName: "title-pattern-phonics",color:this.colorFirst}
    this.level = navParams.get("number");
    this.items = [];
    var data =patternphonic.getDataOfLevel(this.level);
    var number = data[0].text.length;

    data.map(item => {
      this.items.push({
        id: item.id,
        textFirst: item.text.slice(0,item.text.length - number),
        textSecond:item.text.slice(item.text.length - number, item.text.length),
        filename: (item.id>=2) ?patternphonic.getWordLink(item.filename):item.filename
      })
    });

    this.audio.playOne(this.option.getLinkFileAudio(this.firstItem.fileAudioName));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SighWordsPage');
    this.slides.autoplay=1500;
    this.slides.startAutoplay();
  }

  slideChanged() {
    this.playingEvent();
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex===0){
      this.audio.playOne(this.option.getLinkFileAudio(this.firstItem.fileAudioName));
    }else if(currentIndex<this.items.length+1){
      console.log(this.items[0]);
      this.audio.playOne(this.option.getLinkFileAudio(this.items[currentIndex-1].filename));

      if(currentIndex == this.items.length) {
        this.navCtrl.push(SighWordsPage,this.level);
        this.viewCtrl.dismiss();
      }
    }


  }

  slideTap() {
    this.playingEvent();
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex===0){
      this.audio.playOne(this.firstItem.fileAudioName);
    }else if(currentIndex<this.items.length+1){
      this.audio.playOne(this.option.getLinkFileAudio(this.items[currentIndex-1].filename));

      if(currentIndex == this.items.length) {
        this.navCtrl.push(SighWordsPage,this.level);
        this.viewCtrl.dismiss();
      }
    }


  }
  end(){
    this.slides.stopAutoplay();
  }

  slideNext() {
    this.slides.slideNext();
  }

  slidePre() {
    this.slides.slidePrev();
  }

  playingEvent() {
    this.isPlaying = true;
    this.audio.getAudio().onended =  () => {
      this.isPlaying = false;
    }
  }
  onClickBack(){
    this.navCtrl.push(LessonPage, {level: this.level,numberSlide:5});
    this.viewCtrl.dismiss();
  }
}
