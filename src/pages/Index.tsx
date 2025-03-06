
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Train, Users, BookOpen, Clock } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Index = () => {
  const { isAuthenticated } = useUser();

  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: 'בחר תחום לימוד',
      description: 'תלמוד, הלכה, משנה, חומש, חסידות או כל תחום אחר',
    },
    {
      icon: <Train className="h-10 w-10 text-primary" />,
      title: 'הגדר מסלול נסיעה',
      description: 'בחר תחנות ושעות נסיעה ברכבת ישראל',
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'מצא את החברותא המושלמת',
      description: 'המערכת תתאים עבורך חברותא בהתאם להעדפותיך',
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: 'נצל את זמן הנסיעה',
      description: 'הפוך את זמן הנסיעה לזמן איכות של לימוד ושיחה מעשירה',
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 animated-gradient rounded-3xl">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary animate-slide-down">
              יוזמה חדשה לניצול זמן הנסיעה ברכבת
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl animate-slide-down" style={{ animationDelay: '0.1s' }}>
              חברותא ברכבת ישראל
            </h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 animate-slide-down" style={{ animationDelay: '0.2s' }}>
              מצא שותף ללימוד תורה במהלך נסיעותיך ברכבת והפוך את זמן הנסיעה לזמן משמעותי
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6 animate-slide-down" style={{ animationDelay: '0.3s' }}>
              <Link to={isAuthenticated ? "/topics" : "/register"}>
                <Button size="lg" className="hover-lift focus-ring">
                  {isAuthenticated ? 'המשך למציאת חברותא' : 'הצטרף עכשיו'}
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="hover-lift focus-ring">
                איך זה עובד?
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                איך זה עובד
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                מצא חברותא בארבעה צעדים פשוטים
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                תהליך פשוט ומהיר שיעזור לך למצוא את החברותא המתאימה עבורך
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover-lift glass"
              >
                <div className="p-2 rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 rounded-3xl">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                סיפורי הצלחה
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                מה המשתמשים שלנו אומרים
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                משתמשים רבים כבר מצאו חברותא מתאימה דרך הפלטפורמה שלנו
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {[1, 2, 3].map((testimonial) => (
              <div
                key={testimonial}
                className="flex flex-col space-y-2 rounded-lg border p-6 shadow-sm glass"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  "מצאתי חברותא נהדר שלומד איתי כל יום שלישי בדרך לעבודה. הפכנו את זמן הנסיעה למשהו שאני ממש מצפה לו."
                </p>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div>
                    <h4 className="text-sm font-bold">יוסי כהן</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      נוסע מתל אביב לחיפה
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                מוכן למצוא חברותא?
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                הצטרף עכשיו וגלה כמה קל למצוא שותף ללימוד תורה בזמן הנסיעה ברכבת
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row mt-4">
              <Link to={isAuthenticated ? "/topics" : "/register"}>
                <Button size="lg" className="hover-lift focus-ring">
                  {isAuthenticated ? 'המשך למציאת חברותא' : 'הצטרף עכשיו'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
