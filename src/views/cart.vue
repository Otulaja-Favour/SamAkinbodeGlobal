<template>
    <div>
        <navBar />
<cartCom />
    </div>
</template>

<script>
import navBar from '@/components/navBar.vue';
import cartCom from '@/components/cartCom.vue';
    export default {
        components: {cartCom, navBar}
    }
</script>

<style lang="scss" scoped>

</style>