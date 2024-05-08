"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const SignOut = () => {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const signOutUser = async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error);
        router.push('/error'); // 使用 useRouter 钩子进行重定向
      } else {
        router.push('/'); // 使用 useRouter 钩子进行重定向
      }
    };

    signOutUser();
  }, [router, supabase]);

  // 如果你想显示一些 UI，比如加载指示器，可以在这里返回
  return <p>Signing out...</p>;
};

export default SignOut;
