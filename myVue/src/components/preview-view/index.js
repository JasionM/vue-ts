import Vue from 'vue'
import preview from "./preview-view"
const PreviewConstructor = Vue.extend(preview)

const isDOM = (obj) =>{
    if (!obj) {
        return false
    }
    if (typeof HTMLELement === 'object') {
        return obj instanceof HTMLElement
    } else {
        return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'
    }
}

export default {
    bind(el, binding, vnode) {
        const value = binding.value
        if (!isDOM(value.contentDOM) && typeof value.contentDOM !== 'string') {
            throw new Error(`contentDOM类型应该传入DOM或者选择器名称，接收到的结果为${value.contentDOM}`)
            return
        }

        const contentDOM = isDOM(value.contentDOM) ? value.contentDOM : el.querySelector(value.contentDOM)

        const preview = new PreviewConstructor({
            el: document.createElement('div'),
            propsData: {
                viewDOM: el,
                contentDOM: contentDOM,
                width: value.width || '250px',
                height: value.height || '200px',
                position: value.position || null,
            }
        })
        
        el.preview = preview.$el
    },
    inserted(el, binding, vnode) {
        
        el.appendChild(el.preview)
    },
    update(el, binding, vnode) {
        
    },
    componentUpdated(el, binding, vnode) {
        
    },
    unbind(el, binding, vnode) {
        
    }
}