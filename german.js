<!-- Use preprocessors via the lang attribute! e.g. <template lang="pug"> -->
<template>
  <div id="app">
    <h1 v-on:click="pickColor">Flash Cards</h1>
    <div class="flashcard-form">
      <label for="front">Front</label>
      <input type="text" id="front" v-model="newFront" v-on:keypress.enter="addNew"></input>
      <label for="back">Back</label>
      <input type="text" id="back" v-model="newBack" v-on:keypress.enter="addNew"></input>
      <button v-on:click="addNew">Add New Card</button>
      <span class="error" v-show="error">Oops! cards need a front and a back</span>
    </div>
    <ul class="flashcard-list">
      <li v-on:click="flip(card)" v-for="(card, index) in cards" v-bind:style="{'background-color': card.color}">
        <transition name="flip">
        <p class="card" v-bind:key="card.flipped">{{card.flipped ? card.back : card.front}}
          <span class="delete-card" v-on:click="deleteCard(index)">X</span>
        </p>
        
  </transition>
      </li>
      
    </ul>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Welcome to Vue!',
      newFront: '',
      newBack: '',
      error: false,
      cards: [
        {
          front: "Hello World",
          back: "Good Bye World",
          color: '#f8ffe5',
          flipped: false
        },
        {
          front: "Hello World",
          back: "Good Bye World",
          color: '#06d6a0',
          flipped: false
        },
        {
          front: "Hello World",
          back: "Good Bye World",
          color: '#1b9aaa',
          flipped: false
        },
        {
          front: "Hello World",
          back: "Good Bye World",
          color: '#ef476f',
          flipped: false
        },
        {
          front: "Hello World",
          back: "Good Bye World",
          color: '#ffc43d',
          flipped: false
        },
        {
          front: "Hello World",
          back: "Good Bye World",
          color: '#f8ffe5',
          flipped: false
        },
        {
          front: "Hello World",
          back: "Good Bye World",
          color: '#06d6a0',
          flipped: false
        }
      ]
    };
  },
  methods: {
    flip: function(card) {
      card.flipped = !card.flipped;
    }, 
    addNew: function() {
      if (!this.newFront || !this.newBack) { this.error = true
      } else {
      this.error = false
      this.cards.push({
        front: this.newFront,
        back: this.newBack,
        color: this.pickColor(),
        flipped: false
      })
      this.newFront = '',
      this.newBack = ''
      }
    },
    deleteCard: function(index) {
      this.cards.splice(index, 1) 
    }, 
    pickColor: function() {
      var colors = ['#f8ffe5', '#06d6a0', '#1b9aaa', '#ef476f', '#ffc43d'];
      var random_color = colors[Math.floor( 
                    Math.random() * colors.length)];
      return random_color.toString();
      
    }
  }
};
</script>

<!-- Use preprocessors via the lang attribute! e.g. <style lang="scss"> -->
<style>
  
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
  
  input {
    padding: 1% 3%;
  }
  
  label {
    margin: 0 0 0 1%;
  }
  
  button {
    background-color: #06d6a0;
    padding: 1% 3%;
    border: none;
    border-radius: 5%;
    color: white;
  }
  
  button:hover {
    color: #06d6a0;
    background-color: white;
    border: 1px solid #06d6a0;
    
  }
  
  .flashcard-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 2rem;
    margin-top: 4%;
  }
  
  li {
    list-style-type: none;
    height: 20em;
    width: 15em;
    border-radius: 8px;
    color: black;
    position: relative;
  
  }
  
  p {
    text-align: center;
    margin-top: 7em;
  }
  
  .delete-card {
    color: orange;
    position: absolute;
    right: 2em;
    top: 1em;
    -webkit-transition: -webkit-transform .8s ease-in-out;
          transition:         transform .8s ease-in-out;
  }
  
  .delete-card:hover {
    -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
  }

  
  .error {
    display: block;
    color: red;
    margin: 2em;
  }

li:hover {
  transform: scale(1.10);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
  
  .flip-enter-active{
    transition: all 0.4s ease;
  }
  
  .flip-enter {
    transform: rotateY(180deg);
    opacity: 0;
  }
  
  .flip-leave {
    display: none;
  }

</style>