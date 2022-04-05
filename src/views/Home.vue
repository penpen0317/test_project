<template>
    <div class="home">
        <h1>ログイン済</h1>
        <hr>
        <Button name='sample'/>
        <hr>
        <!--ログアウトコンポーネント-->
        <amplify-sign-out></amplify-sign-out>
    </div>
</template>

<script>
    import Button from '@/components/Button.vue'

    export default {
        name: 'home',
        components: {
            Button
        }
    }
</script>
