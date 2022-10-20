import { DirectiveBinding } from 'vue'

const fullscreen = (elem: HTMLElement, bindVal: DirectiveBinding<Boolean>) => {
    if (bindVal.value) {
        elem.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}
export default fullscreen
