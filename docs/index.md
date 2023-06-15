<script setup>
import { useRouter } from 'vitepress'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  router.go('/faq/')
})
</script>

Redirecting to the [FAQ](/faq/)...
