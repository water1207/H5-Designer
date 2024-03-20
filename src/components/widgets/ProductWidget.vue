<template>
    <div class="Product">
        <p>名称</p>
        <p>{{ _name }}</p>
        <div class="line-container"></div>
        <p>介绍</p>
        <p>{{ _desc }}</p>  
    </div>
</template>

<script>
export default {
    props: {
        name: String,
        desc: String,
        switchStates: {
            type: Array,
            default: () => [false, false, false],
        },
        notes: {
            type: Array,
            default: () => ['', '', ''],
        },
    },
    data() {
        return {
            _name: this.name,
            _desc: this.desc,
            _SwitchStates: [...this.switchStates],
            _Notes: [...this.notes],
        };
    },
    watch: {
        name(newVal) {
            this.myName = newVal;
        },
        desc(newVal) {
            this.myDesc = newVal;
        },
        switchStates: {
            deep: true,
            handler(newVal) {
                this.mySwitchStates = [...newVal];
            }
        },
        notes: {
            deep: true,
            handler(newVal) {
                this.myNotes = [...newVal];
            }
        }
    }
}
</script>
