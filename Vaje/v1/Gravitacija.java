import java.util.*;

public class Gravitacija {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        float visina = sc.nextFloat();
        izpis(visina, gravitacija(visina));
    }

    static float gravitacija(float visina) {
        final float C = 6.674e-11f;
        final float M = 5.972e24f;
        final float R = 6.371e6f;

        return (C * M) / ((R + visina) * (R + visina));
    }

    public static void izpis(float visina, float gravitacija) {
        System.out.printf("Višina: %f\nGravitacija: %f\n", visina, gravitacija);
    }
}