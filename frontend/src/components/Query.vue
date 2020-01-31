<template>
    <div> <br>
        <v-btn v-on:click="logout()" color="#b35110" style="margin-left: 1750px;"> Logout </v-btn>
        <br><br><br><br><br><br><br>
    <v-card class="card-view">
        <v-card-title> <v-icon large left>book</v-icon> Add a Book </v-card-title> <br> <br>
        <v-text-field  v-model="name" label="Name of the Book..." class="InputBlock" solo></v-text-field>
        <v-text-field  v-model="genre" label="Genre of the Book..." class="InputBlock" solo></v-text-field>
        <v-text-field  v-model="authorName" label="Author of the Book..." class="InputBlock" solo></v-text-field> <br>
        <v-btn  v-on:click="createBook()" class="SubmitButton" :loading="loading"> Create </v-btn>
    </v-card>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    </div>
</template>

<script>
import router from '../router'

export default {
    data: () => ({
        info: {},
        loading: false,
    }),

    created() {
        this.checkLoggedIn();
    },

    methods: {
        createBook() {
            this.loading = true;
            this.$apollo.mutate({
                mutation: require('../graphql/addBook.gql'),
                variables: {
                    name       : this.name,
                    genre      : this.genre,
                    authorName : this.authorName
                }
            }).then(res => {
                this.loading = false;
                console.log(res);        
            })
            .catch((err) => {
                console.log(err);
            })
        },
        logout() {
            localStorage.removeItem('apollo-token');
            router.push('/login');
        },
        checkLoggedIn() {
            if (!localStorage.getItem('apollo-token')) {
                router.push('/login');
            }
        }
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
        margin-left: 120px;
        margin-top: -130px;
        width: 400px;
        height: 420px;
    }
    div {
        background-image: url('https://www.softpaz.com/wallpapers/download/31661/shraddha-kapoor-2016-4k-1920-1200.jpg');
    }
</style>