import { defineStore } from 'pinia';
import { ref, computed } from 'vue-demi'

import { UserType, UserTypeEnum } from '@/config/userType'

type Coords = [number, number] | [string, string]

export const useUserStore = defineStore('user', () => {
    const geoCoords = ref<Coords>()
    const userType = ref<UserType>()
    const userPageType = ref<UserType>()
    function setUserType(val: UserType) {
        userType.value = val || UserTypeEnum.commonUser
    }
    function setGeoCoords(val: Coords) {
        geoCoords.value = val
    }

    return { geoCoords, userType, userPageType, setUserType, setGeoCoords }
})

export default useUserStore