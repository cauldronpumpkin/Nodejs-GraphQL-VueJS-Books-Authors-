<template>
    <div> <br><br><br><br><br><br><br>
    <v-card color="#26c6da" class="card-view">
        <v-card-title> <v-icon large left>person</v-icon> Login </v-card-title> <br> <br>
        <v-text-field  v-model="username" label="Username" class="InputBlock" solo></v-text-field>
        <v-text-field  v-model="password" label="Password" class="InputBlock" type="password" solo></v-text-field> <br>
        <v-btn  v-on:click="verifyUser()" class="SubmitButton" :loading="loading"> Login </v-btn>
    </v-card>
        <br><br><br><br><br>
    </div>
</template>

<script>
import router from '../router';
export default {
    data: () => ({
        info: {},
        loading: false,
    }),

    methods: {
        verifyUser() {
            this.loading = true;
            this.$apollo.mutate({
                mutation: require('../graphql/login.gql'),
                variables: {
                    username : this.username,
                    password : this.password,
                }
            }).then(res => {
                this.loading = false;
                let token = res.data.verifyUser.token;
                localStorage.setItem('apollo-token', token);
                router.push('/addbook');
            })
        },
    }
    
}
</script>

<style scoped>
    .InputBlock {
        margin-left: 65px;
        width: 290px;
    }
    .SubmitButton {
        margin-left: 20px;
    }
    .card-view {
        margin-left: 730px;
        width: 400px;
        height: 350px;
    }
</style>