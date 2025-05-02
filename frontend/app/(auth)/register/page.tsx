import React, {Suspense} from 'react'
import AuthForm from '@/components/forms/auth/auth-form'

export default function page() {
    return (
        <Suspense>
            <AuthForm type="sign-up"/>
        </Suspense>
    )
}
