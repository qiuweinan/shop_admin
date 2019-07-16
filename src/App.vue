<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
html,
body,
#app {
  height: 100%;

  .el-breadcrumb {
      height: 50px;
      line-height: 50px;
      padding-left: 6px;
      background-color: #d4dae0;
      font-size: 16px;
    }
}
</style>
