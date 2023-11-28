<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div
        class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header id="modalTitle" class="modal-header">
          <slot name="header">
            <!-- <h3>This is the default tile!</h3> -->

            <button type="button" class="btn-close" aria-label="Close modal" @click="close">x</button>
          </slot>
        </header>
        <section id="modalDescription" class="modal-body">
          <slot name="body">
            <p>
              <!-- I'm the default body! -->
            </p>
          </slot>
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            <!-- I'm the default footer! -->

            <button type="button" class="btn btn-red" aria-label="Close modal" @click="close">Close</button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
#app {
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: #ffffff;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    margin: auto;
    max-height: calc(100% - 100px);
    max-width: calc(100% - 300px);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: auto;
    width: auto;
    padding: 10px;
    overflow-y: auto;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    border-bottom: none;
    color: #4aae9b;
    justify-content: space-between;
    div {
      width: 100%;
    }
    h3 {
      font-size: 1.5rem;
      margin-top: 0;
      white-space: nowrap;
    }
  }

  .modal-footer {
    border-top: none;
    justify-content: flex-end;
    padding-bottom: 10px;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-close {
    border: none;
    font-size: 20px;
    padding: 0;
    margin: -17px -10px 0 0;
    cursor: pointer;
    font-weight: bold;
    color: #4aae9b;
    background: transparent;
    float: right;
  }

  .btn {
    color: white;
    border-width: 1px;
    border-style: solid;
    border-radius: 2px;
  }

  .btn-green {
    color: white;
    background-color: #4aae9b;
    border-color: #4aae9b;
  }

  .btn-red {
    background-color: #dc3545;
    border-color: #dc3545;
  }
  &.theme--dark {
    .modal-backdrop {
      .modal {
        background: #333;
      }
    }
  }
}
</style>
