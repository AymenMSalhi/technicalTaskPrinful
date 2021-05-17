<template>
  <div class="container-app">
    <div class="container-quiz">
      <div class="step-progress" :style="{'width': progress + '%'}"></div>


      

      <div class="start-form p-3 col-12" v-if="questions == null">
          <h1 class="my-5">Technical task</h1>
          <div id="startalert" ref="startalert" class="alert text-danger mx-auto my-3" role="alert">
            Please, enter Your Name and choose a test first!
          </div>
          <div class="row p-0 col-12 mx-0">
            <div class="form-group col-sm-8 col-md-6 mx-auto">
              <input v-model="username" type="text" class="form-control"  placeholder="Enter your name">
            </div>
          </div>
          <div class="row p-0 col-12 mx-0">
            <div class="form-group col-sm-8 col-md-6 mx-auto">
              <select v-model="testid" class="form-control">
                <option value="" selected>Choose test</option>
                <option v-for="test in tests" :key="test.id" v-bind:value="test.id">{{ test.title }}</option>
              </select>
            </div>
          </div>
          <div class="row col-12 mx-0">
            <div class="form-group text-right col-sm-6 mx-auto">
              <button @click="startFN" class="btn btn-primary col-6">Start</button>
            </div>
          </div>
      </div>

      <div v-if="questions != null">
          <div class="main-quiz" v-for="(element, index) in questions.slice(a,b)" :key="index" v-show="quiz"><!--.slice(a,b)-->
            <div class="box-question">  
              <h2 class="my-5">Question {{b}}/{{questions.length}}</h2>
              <p>{{element.title}}</p>
            </div>
            <div class="box-suggestions">
              <button class="btn responseitem" v-for="(item, index) in answers" :key="index" @click="selectResponse(item)">{{item.title}}
              </button>
            </div>
          </div>
          <div class="box-score my-5" v-if="score_show">
            <h2>Thanks, {{ username }}</h2>
            <p> You responded correctly to <strong>{{score}}</strong> out of <strong>{{questions.length}}</strong> questions.</p>
          </div>
          
          <div class="quiz-footer" v-if="progress < 100">
            <div class="box-button">
              <button class="btn" @click="nextQuestion" :style="next ? 'background: rgb(106, 128, 202)' : ''">Next</button>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>

//import HelloWorld from './components/HelloWorld.vue'

const axios = require('axios').default;

export default {
  name: 'App',
  
  data() {
    return {
      
      questions: null,
      answers: null,
      tests: null,

      username: null,
      testid: '',

      i:1,
      a:0,
      b:1,
      select:false,
      score:0,
      quiz:true,
      score_show:false,
      next:false,
      progress:0,
      reponseid: null,
      selectedAnswer: null,
      correctanswer: 0,
      selectedoption: null

    }
  },

  created() {
    console.log("created")
    axios.get('https://printful.com/test-quiz.php?action=quizzes').then(res => (
      this.tests = res.data
    ))
  },



  methods: {
    
    startFN() {
      if (this.username == null || this.testid =='') {
        this.$refs.startalert.style.display = "block";
      } else {
        this.$refs.startalert.style.display = "none";
      }

      console.log('test id : '+this.testid)
      axios.get('https://printful.com/test-quiz.php?action=questions&quizId='+this.testid).then(res => (
        this.questions = res.data,

        axios.get('https://printful.com/test-quiz.php?action=answers&quizId='+this.testid+'&questionId='+this.questions[this.a].id).then(res => (
          this.answers = res.data
        ))
      ))
      
    },

    selectResponse(e) {

      this.reponseid = e.id;
      this.select = true;
      this.next = true;

    },

    focusevent(i) {
      alert(i);
    },

    nextQuestion() {

      axios.get('https://printful.com/test-quiz.php?action=submit&quizId='+this.testid+'&answers[]='+this.reponseid).then(res => (
        this.selectedAnswer = res.data,
        this.correctanswer = this.selectedAnswer.correct
      ))

      if(this.correctanswer == 1 && this.select == true) {
          this.score++;
        } 

      if (!this.next) {
        return;
      }

      this.progress = this.progress + (100/this.questions.length);

      if (this.i < this.questions.length) {
          axios.get('https://printful.com/test-quiz.php?action=answers&quizId='+this.testid+'&questionId='+this.questions[this.i].id).then(res => (
            this.answers = res.data,
            this.i++
          ))
      }

      if (this.questions.length - 1 == this.a) {

        console.log('last question');
        console.log(this.correctanswer);
        if(this.correctanswer == 1) {
          this.score++;
        } else {
          this.correctanswer = 0; 
        }

        this.score_show = true;
        this.quiz = false;
      } else {
        this.a++;
        this.b++;
        this.select = false;
        this.next = false;
        this.correctanswer = 0;
      }  
    }

  }
}
</script>